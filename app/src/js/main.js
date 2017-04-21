// styles
import '../scss/main.scss';

// data
import data from '../../data.json';

// redux
import { createStore } from 'redux';
import reducers from './application/reducers/';

// IsoGrid
import IsoGrid from './application/IsoGrid';
import { defaultState } from './configuration/defaultState';

// Custom JS
import 'core-js/fn/promise';
import performancePolyfill from './custom/performancePolyfilly';
import { clockHandler } from './custom/clock';
import Navigation from './custom/nav';
import { newWindowfyLinks } from './custom/xWindow';
import { init as fullScreenInit } from './custom/fullScreen';

import * as debounce from 'debounce';

const Grid = new IsoGrid(createStore(reducers, Object.assign({}, defaultState, data), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()));
const outerwrap = document.getElementById('isogridWrap');
const viewport = document.querySelector("meta[name=viewport]");

fullScreenInit();

outerwrap.addEventListener('loaded', () => {
	window.requestAnimationFrame(()=>{
		initExtras(outerwrap);
	});
},{ once: true });

const initExtras = (outerwrap) => {
	const wrap = Grid.wrap.parentNode;
	const loader = document.getElementById('loader');

	wrap.scrollLeft = (Grid.wrap.offsetWidth / 2) - (window.innerWidth / 2);
	wrap.scrollTop = (Grid.wrap.offsetHeight / 2) - (window.innerHeight / 2);
	loader.classList.add('hidden');
	outerwrap.classList.remove('hidden');
	clockHandler();
	new Navigation(Grid);
	newWindowfyLinks();
}