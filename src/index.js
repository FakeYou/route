import fs from 'fs';

import { createWindow, getHtml } from './window';
import { drawMap, drawRoute, GPX } from './map';

const route = fs.readFileSync('./data/vilnius_halfmarathon_20140914T0830.gpx', 'utf8');

createWindow()
	.then(() => drawRoute(route, GPX))
	.then(() => {
		const html = getHtml();

		console.log('writing html to file');
		fs.writeFileSync('./tmp/map.html', html);
	})
	.catch(console.error.bind(console));
