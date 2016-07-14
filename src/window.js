import d3 from 'd3';
import jsdom from 'jsdom';

import tile from './plugins/tile';

let window;
let svg;

export function createWindow() {
	return new Promise((resolve, reject) => {
		const done = (err, _window) => {
			if(err) {
				reject(err);
				return;
			}

			window = _window;

			window.d3 = d3.select(window.document);

			svg = window.d3.select('body')
				.append('div').attr('class', 'container')
				.append('svg').attr({
					xmlns: 'http://www.w3.org/2000/svg',
					width: 500,
					height: 500
				});

			resolve(window);
		}

		jsdom.env({
			html: '',
			features: { querySelector: true },
			done
		});
	});
}

export function getWindow() {
	return window;
}

export function getSvg() {
	return svg;
}
