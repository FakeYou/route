import d3 from 'd3';
import axios from 'axios';
import { jsdom } from 'jsdom';
import { kml, gpx } from 'togeojson';
import { flatten } from 'lodash';

import geotile from './plugins/tile';
import { getSvg } from './window';

export const GPX = 'GPX';
export const KML = 'KML';

export function drawRoute(data, type) {
	return new Promise((resolve, reject) => {
		let route;

		switch(type) {
			case KML:
				route = kml(jsdom(data));
				break;
			case GPX:
				route = gpx(jsdom(data));
				break;

			default:
				return reject(`unknown type: ${type}`);
		}

		const bounds = d3.geo.bounds(route);

		drawTiles(getSvg(), bounds)
			.then(resolve)
			.catch(reject);
	});
}

function drawTiles(svg, bounds) {
	const width = svg.attr('width');
	const height = svg.attr('height');

	const projection = getProjection(bounds, width, height);
	const scale = projection.scale() * 2 * Math.PI;

	const tile = geotile().size([ width, height ]);
	const path = d3.geo.path().projection(projection);
	const tiles = tile.scale(scale).translate(projection([0, 0]));

	return new Promise((resolve, reject) => {
		const promises = [];

		svg.selectAll('g')
			.data(tiles)
			.enter().append('g')
				.each(function(d) {
					promises.push(drawTile.call(this, d, path));
				});

		Promise.all(promises)
			.then(() => {console.log('resolved'); resolve()})
			.catch(reject);
	});
}

function drawTile(d, path) {
	const layers = ['water', 'landuse', 'roads', 'buildings'];

	return new Promise((resolve, reject) => {
		const g = d3.select(this);
		const url = `https://vector.mapzen.com/osm/${layers.join(',')}/${d[2]}/${d[0]}/${d[1]}.json?api_key=vector-tiles-ZQsaRt5`;

		axios.get(url)
			.then(response => {
				console.log(`fetched ${url}`, response.status);

				const data = response.data;
				const features = [];

				layers.forEach(layer => {
					data[layer].features.forEach(feature => {
						if(feature.label_placement === 'yes') {
							return;
						}

						feature.layer = layer;
						features.push(feature);
					});
				});

				g.selectAll('path')
					.data(features.sort((a, b) => a.properties.sort_key - b.properties.sort_key))
				.enter().append('path')
					.attr('class', d => d.properties.kind)
					.attr('d', path);

				resolve();
			})
			.catch(reject);
	})
}

function getProjection(bounds, width, height) {
	const center = getCenter(bounds);
	const scale = getScale(bounds, width, height);

	return d3.geo.mercator()
		.center(center)
		.scale(scale)
		.translate([width / 2, height / 2]);
}

function getCenter(bounds) {
	return [
		(bounds[1][0] + bounds[0][0]) / 2,
		(bounds[1][1] + bounds[0][1]) / 2
	];
}

function getScale(bounds, width, height) {
	return 40 / Math.max(
		(bounds[1][0] - bounds[0][0]) / width,
		(bounds[1][1] - bounds[0][1]) / height
	);
}