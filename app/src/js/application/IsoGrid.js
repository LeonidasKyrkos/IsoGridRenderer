import Grid from './components/grid/';
import dragscroll from 'dragscroll';
import { findSquare } from './utils/findSquare';
import { colWidth as sqWidth, rowHeight as sqHeight, cvWidth, cvHeight } from './constants/dimensions';
import { settings } from './constants/isoGridSettings';

export default class IsoGrid {
	/**
	 * Instantiates the IsoGrid Object
	 * @constructor
	 * @param {Object} redux store
	 * @return void
	 */
	constructor(store) {
		this.wrap = document.getElementById('isogrid');
		this.wrap.setAttribute('style',`width: ${cvWidth * 2}px; height: ${cvHeight}px`);
		this.store = store;
		this.settings = Object.assign({},settings);
		this.init();
	}


	/**
	 * Initialise the 3 core components of IsoGrid. Grid renderer and 2 builder palettes
	 * @return void
	 */
	init() {
		this.Grid = new Grid(this.store);
		this.currentScale = 1;
		this.settings.zoomIncrement = 0.2;
	}

	/**
	 * Turn off dragscroll on mobile
	 * @return void
	 */
	disableDragscroll() {
		this.wrap.parentNode.classList.remove('dragscroll');
		dragscroll.reset()
	}

	/**
	 * Zooms the canvas out using a css transform
	 * @return void
	 */
	zoomOut() {
		if(this.settings && this.settings.zoomIncrement) {
			this.currentScale -= this.settings.zoomIncrement;
			this.wrap.style.transform = `scale3d(${this.currentScale},${this.currentScale},${this.currentScale})`;
			this.wrap.style['transform-origin'] = `${this.wrap.parentNode.scrollLeft - window.innerWidth / 2}px ${this.wrap.parentNode.scrollTop + window.innerHeight / 2}px`;
		}
	}

	/**
	 * Zooms the canvas in using a css transform
	 * @return void
	 */
	zoomIn() {
		if(this.settings && this.settings.zoomIncrement) {
			this.currentScale += this.settings.zoomIncrement;
			this.wrap.style.transform = `scale3d(${this.currentScale},${this.currentScale},${this.currentScale})`;
			this.wrap.style['transform-origin'] = `${this.wrap.parentNode.scrollLeft - window.innerWidth / 2}px ${this.wrap.parentNode.scrollTop + window.innerHeight / 2}px`;
		}
	}

	/**
	 * Tells the grid renderer to pause
	 * @return void
	 */
	pauseAnimation() {
		this.Grid.pause();
	}

	/**
	 * Tells the grid renderer to unpause
	 * @return void
	 */
	unpauseAnimation() {
		this.Grid.unpause();
	}

	/**
	 * Delete the animation canvas'
	 * @return void
	 */
	lowPerformanceMode() {
		this.pauseAnimation();
		[].slice.call(document.querySelectorAll('canvas')).forEach( el => {
			el.remove();
		});
	}
}