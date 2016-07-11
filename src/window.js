import d3 from 'd3';
import jsdom from 'jsdom';

export function createWindow() {
	return new Promise((resolve, reject) => {
		const done = (err, window) => {
			if(err) {
				reject(err);
				return;
			}

			window.d3 = d3.select(window.document);
			window.d3.select('body')
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
