import d3 from 'd3';
import axios from 'axios';

import geotile from './plugins/tile';
import { getSvg } from './window';

export function drawMap() {
	const svg = getSvg();
	const width = svg.attr('width');
	const height = svg.attr('height');

	const tile = geotile()
		.size([ width, height ]);

	const projection = d3.geo.mercator()
		.center([-122.4183, 37.7750])
		.scale((1 << 21) / 2 / Math.PI)
		.translate([width / 2, height / 2]);

	const path = d3.geo.path()
		.projection(projection);

	const tiles = tile
		.scale(projection.scale() * 2 * Math.PI)
		.translate(projection([0, 0]));

	return new Promise((resolve, reject) => {
		svg.selectAll('g')
			.data(tiles)
			.enter().append('g')
				.each(function(d) {
					const g = d3.select(this);
					const url = `https://vector.mapzen.com/osm/roads/${d[2]}/${d[0]}/${d[1]}.json?api_key=vector-tiles-LM25tq4`;

					axios.get(url)
					.then(response => {
						const json = response.data;

						g.selectAll('path')
							.data(json.features.sort((a, b) => a.properties.sort_key - b.properties.sort_key))
						.enter().append('path')
							.attr('class', d => d.properties.kind)
							.attr('d', path);

					}).catch(reject);
				});

		setTimeout(resolve, 5000);
	});
}
