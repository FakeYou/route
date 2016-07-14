import fs from 'fs';

import { createWindow, getWindow } from './window';
import { drawMap } from './map';

createWindow()
	.then(() => drawMap())
	.then(() => {
		const window = getWindow();
		const html = window.d3.select('.container').html();

		fs.writeFileSync('./tmp/map.html', html);
	})
	.catch(console.error.bind(console));
