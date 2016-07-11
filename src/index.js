import { createWindow } from './window';

createWindow()
	.then(window => {
		const svg = window.d3.select('svg');

		console.log(window.d3.select('.container').html());
	})
	.catch(console.error.bind(console));
