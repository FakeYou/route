import d3 from 'd3';
import jsdom from 'jsdom';
import readFile from 'fs-readfile-promise';
import path from 'path';

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
					width: 1000,
					height: 800
				});

			addStyle(path.resolve(__dirname, './style/basic.css'))
				.then(() => resolve(window))
				.catch(reject);
		}

		jsdom.env({
			html: '<html><head></head><body></body></html>',
			features: {
				querySelector: true,
				fetchExternalResources: ['css']
			},
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

export function getHtml() {
	return window.document.documentElement.outerHTML;
}

function addStyle(styleFile) {
	return new Promise((resolve, reject) => {
		const window = getWindow();
		const document = window.document;
		const head = document.head;

		readFile(styleFile)
			.then(buffer => {
				const style = document.createElement('style');
				style.type = 'text/css';
				style.innerHTML = buffer.toString();
				head.appendChild(style);

				resolve();
			})
			.catch(reject);
	})
}