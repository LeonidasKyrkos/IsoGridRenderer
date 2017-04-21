import { rows, cols, colWidth, rowHeight, cvWidth as width, cvHeight as height } from '../../constants/dimensions';
import { updateSquareTerrain, addSquares } from '../../actions';
import Square from '../../components/square';
import deepEqual from 'deep-equal';
import { instantiateImages, instantiateAnimationImages } from '../../utils/instantiateImages';
import { getSquarePoints } from '../../utils/getSquarePoints';
import { assets as html } from '../../constants/html';
import { refreshRate } from '../../constants/settings';
import _ from 'lodash';
import { updateAnimationHandler, updateDimensions as AnimationsUpdateDimensions } from '../animations/submodules/updateHandlers.js';
import { setupCanvasTypes } from './submodules/canvasTypes';
import getAnimationImage from '../../utils/getAnimationImage';
import debounce from 'debounce';

// Grid build system. It takes whatever data we give it and spits out a grid to match. 
// Doesn't have any update methods. It just diffs the new state and triggers a re-render where necessary.

const loaded = new Event('loaded');
const mobile = window.innerWidth < 900;

export default class Grid {
	constructor(store, canvas) {
		this.store = store;		
		this.wrap = document.getElementById('isogrid');
		this.dragscroll = document.getElementById('dragscroll');
		this.lastRender = 0;
		this.canvasTypes = setupCanvasTypes(this);
		this.canvasTypesArray = Object.keys(this.canvasTypes).map(type => this.canvasTypes[type]);		
		this.paused = false;
		this.drawGridSquare = this.drawGridSquare;
		this.htmlLoop = this.htmlLoop;

		this.init();
	}

	/**
	 * Initialise grid. Call setup on canvases and tiles. Load required images and attach event handlers
	 * @return void
	 */
	init() {
		const state = this.store.getState();

		this.setup();
		
		if(!state.gridSquares || state.gridSquares && !state.gridSquares.length) {
			this.setupGridSquares();
		}

		this.loadImages(state);
		this.attachEventHandlers();
	}

	/**
	 * loop through canvases and set up the dimensions, contexts, and any related options
	 * @return void
	 */
	setup() {
		for(let prop in this.canvasTypes) {
			const canvasGroup = this.canvasTypes[prop];
			canvasGroup.init.call(this);

			canvasGroup.members && canvasGroup.members.forEach((canvas, index) => {
				canvas.width = width/3;
				canvas.height = height/2;
				canvas.index = index;
				canvas.col = parseInt(canvas.getAttribute('data-col'));
				canvas.row = parseInt(canvas.getAttribute('data-row'));
				canvas.ctx = canvas.getContext('2d');
			});
		}
	}

	/**
	 * Create the grid squares array
	 * @return void
	 */
	setupGridSquares() {
		let gridSquares = [];

		for(let row = 0; row <= rows; row++) {
			let arr = [];
			for(let col = 0; col <= cols; col++) {
				let gridSquare = new Square({ row, col });
				arr.push(gridSquare);
			}
			gridSquares.push(arr);
		}

		this.store.dispatch(addSquares(gridSquares));
	}

	/**
	 * Load all our images and then begin rendering
	 * @param {obj} state 
	 * @return void
	 */
	loadImages(state) {
		// load images and render when complete
		this.images = {};
		let terrain = instantiateImages(state.assets.terrain);
		let structure = instantiateImages(state.assets.structure);
		let structureUnder = instantiateImages(state.assets.structureUnder);
		let animations = instantiateAnimationImages(state.assets.animations);

		terrain.then( terrain => {
			this.images.terrain = terrain;
		})

		structure.then( structure => {
			this.images.structure = structure;
		});

		animations.then( animations => {
			this.animations = animations;
		})

		structureUnder.then( subStructures => {
			this.images.structureUnder = subStructures;
		})

		Promise.all([terrain, structure, structureUnder, animations]).then(()=>{
			this.startRendering();			
			this.handleChange();
			this.store.subscribe(this.handleChange.bind(this));
			this.handleScroll();		
		});
	}

	/**
	 * Attach event handlers to the wrapper to listen for play and pause requests.
	 * @return void
	 */
	attachEventHandlers() {
		this.wrap.addEventListener('pause',this.pause.bind(this));
		this.wrap.addEventListener('play',this.unpause.bind(this));
		this.dragscroll.addEventListener('scroll',debounce(this.handleScroll.bind(this),16));
		window.addEventListener('resize',debounce(this.handleScroll.bind(this),16));
	}

	/**
	 * Render loop with a requestAnimationFrame engine
	 * @return void
	 */
	startRendering() {
		window.requestAnimationFrame(()=>{
			if(!this.paused && performance.now() - this.lastRender >= refreshRate) {
				this.lastRender = performance.now();
			
				!mobile && this.render();
				mobile && this.mobileRender();
			}
			

			!mobile && this.startRendering();
		})
	}

	/**
	 * Render handler that calls the appropriate rendering methods
	 * @return void
	 */
	render() {
		const state = this.store.getState();

		if(this.imagesConverted) {
			this.pause();
			updateAnimationHandler(state, this.animations);
			this.drawAnimations(state.animations);
			this.unpause();
		} else {
			this.handleStaticCanvases(state);
		}	
	}

	/**
	 * Mobile version of the render method
	 */
	mobileRender() {
		const state = this.store.getState();
		this.handleMobileStaticCanvases(state);
	}

	/**
	 * Handle the desktop devices canvas conversion
	 * @param {obj} state 
	 */
	handleStaticCanvases(state) {
		this.pause();
		this.renderCanvases(state);
		let html = this.htmlLoop(state.gridSquares);
		let canvasImages = this.convertCanvasesToImages(state);

		Promise.all([html, canvasImages]).then(()=>{
			this.canvasTypesArray.forEach(type => { type.getMembers() })
			this.imagesConverted = true;
			document.getElementById('isogridWrap').dispatchEvent(loaded);
			this.unpause();
		});
	}


	/**
	 * Handle the mobile/tablet devices canvas conversion
	 * @param {obj} state 
	 */
	handleMobileStaticCanvases(state) {
		this.renderCanvases(state);
		let html = this.htmlLoop(state.gridSquares);
		let canvasImages = this.convertCanvasesToImages(state);

		Promise.all([html, canvasImages]).then(()=>{
			this.canvasTypesArray.forEach(type => { type.getMembers() });
			this.imagesConverted = true;
			document.getElementById('isogridWrap').dispatchEvent(loaded);
		});
	}

	canvasGroupRequiresRender(canvasGroup) {
		return (canvasGroup.id !== 'animation' && canvasGroup.id !== 'animationUnder') && (canvasGroup.render && canvasGroup.queued || canvasGroup.render && typeof canvasGroup.queued === 'undefined')
	}

	renderCanvases(state) {		
		this.canvasTypesArray.forEach(canvasGroup => {
			if(this.canvasGroupRequiresRender(canvasGroup) && canvasGroup.id !== 'animation' && canvasGroup.id !== 'animationUnder') {
				canvasGroup.render(state.gridSquares);
			}
		});	
	}

	convertCanvasesToImages() {
		return new Promise((resolve, reject)=>{
			this.canvasTypesArray.forEach(canvasGroup => {
				if(this.canvasGroupRequiresRender(canvasGroup)) {
					let docFrag = document.createDocumentFragment();

					canvasGroup.members.forEach(canvas => {
						docFrag.appendChild(this.convertCanvasToImage(canvas));
						canvas.remove();
					});

					canvasGroup.parent.appendChild(docFrag);
					canvasGroup.queued = false;
				}
			});

			resolve();
		});		
	}

	convertCanvasToImage(canvas) {
		let src = canvas.toDataURL('image/png');
		let img = document.createElement('img');
		img.src = src;
		img.classList.add('canvas');

		return img;
	}

	/**
	 * Receives all the animation items and draws them to the screen if they are inside the viewport and active
	 * @param {object} animations 
	 * @return void
	 */
	drawAnimations(animations) {
		animations.forEach(animation => {
			if(animation.previousCoordinates && animation.previousDirection) {
				const previousImage = getAnimationImage(this.animations,animation.type,animation.previousDirection);

				const canvasArray = this.getCanvases(
					animation.previousCoordinates.x, 
					animation.previousCoordinates.y, 
					previousImage.width, 
					previousImage.height,
					animation.zIndex
				);

				canvasArray.forEach( canvas => {
					const offset = this.calculateAnimationOffset(canvas, animation);

					this.clearCoordinates(canvas.ctx, animation.previousCoordinates.x - offset.x - 10, animation.previousCoordinates.y - offset.y - 10, previousImage.width + 20, previousImage.height + 20);
				});
			}

			if(animation.active && animation.visible) {
				const image = getAnimationImage(this.animations,animation.type,animation.direction);
				const canvasArray = this.getCanvases(animation.currentCoordinates.x, animation.currentCoordinates.y, image.height, image.width, animation.zIndex);

				canvasArray.forEach(canvas => this.drawAnimationToCanvas(canvas, animation));
			}

			animation.previousCoordinates = _.cloneDeep(animation.currentCoordinates);
			animation.previousDirection = animation.direction;
		})
	}

	/**
	 * Take a canvas element and an animation object and draw it
	 * @param {dom node} canvas 
	 * @param {obj} animation 
	 */
	drawAnimationToCanvas(canvas, animation) {
		const offset = this.calculateAnimationOffset(canvas, animation);
		const image = getAnimationImage(this.animations,animation.type,animation.direction);

		this.drawAnimationImage(canvas, animation.currentCoordinates.x - offset.x, animation.currentCoordinates.y - offset.y, image);
	}

	/**
	 * Calculate the required offset to account for image dimensions and canvas position
	 * @param {dom node} canvas 
	 * @param {obj} animation 
	 */
	calculateAnimationOffset(canvas, animation) {
		const image = getAnimationImage(this.animations,animation.type,animation.direction);
		const imageObj = this.animations[animation.type];
		const x = (canvas.col * canvas.width) + image.width/2 + imageObj.offsetX;
		const y = canvas.row === 0 ? image.height/2 - imageObj.offsetY : canvas.height + image.height/2 - imageObj.offsetY;

		return { x, y };
	}

	/**
	 * Draw provided image to provided canvas at provided coordinates
	 * @param {DOM node} canvas 
	 * @param {obj} coordinates
	 * @param {DOM node} image
	 * @return void
	 */
	drawAnimationImage(canvas, x, y, image) {
		canvas.ctx.drawImage(image, x, y);
	}

	/**
	 * Receives a canvas, coordinates and dimensions and clears them.
	 * @param {obj} ctx 
	 * @param {int} x 
	 * @param {int} y 
	 * @param {int} width 
	 * @param {int} height 
	 * @return void
	 */
	clearCoordinates(ctx, x, y, width, height) {
		ctx.clearRect(x, y, width, height);
	}

	/**
	 * Find the canvas nodes that need clearing
	 * @param {int} x coordinate 
	 * @param {int} y coordinate 
	 * @param {int} previous image width
	 * @param {int} previous image height 
	 * @param {int} animation zIndex
	 * @return {array} of canvas contexts
	 */
	getCanvases(x, y, imageWidth, imageHeight, zIndex) {
		const type = zIndex === 0 ? 'animationUnder' : 'animation';
		const canvasGroup = this.canvasTypes[type].members;

		const arr = canvasGroup.filter((canvas,index) => {
			const canvasLeft = canvas.col * canvas.width;
			const canvasTop = canvas.row === 0 ? 0 : canvas.height;

			return 	x + imageWidth >= canvasLeft && 
					x - imageWidth <= canvasLeft + canvas.width && 
					y + imageHeight >= canvasTop && 
					y - imageHeight <= canvasTop + canvas.height;
		});

		return arr;
	}

	/**
	 * Draw the set image to the tile. Called by the canvasTypes module.
	 * @param {obj} square 
	 * @param {int} type 
	 * @return void
	 */
	drawGridSquare(canvas, square,type) {
		if(square && square.brushes && square.brushes[type] && this.images[type][square.brushes[type]]) {
			const gridPosition = [].slice.call(canvas.parentNode.children).indexOf(canvas);
			const ctx = canvas.getContext('2d');
			const tID = square.brushes[type];
			const image = this.images[type][tID].image;
			const imageOffsetY = this.images[type][tID].offsetY || 0;
			const imageOffsetX = this.images[type][tID].offsetX || 0;
			const row = square.position.row;
			const col = square.position.col;

			
			const offsetX = gridPosition > 2 ? Math.floor((gridPosition - 3) * width/3) : Math.floor(gridPosition * width/3) ;
			const offsetY = gridPosition > 2 ? canvas.height : 0;
			const x = (row % 2 === 0 ? colWidth * col : (colWidth * col) +  colWidth/2) - offsetX;
			const y = (((rowHeight / 2) * row) + rowHeight/2) - offsetY;

			if(image) {
				ctx.drawImage(image, Math.floor(x + imageOffsetX), Math.floor((y - image.height/2) + imageOffsetY));
			}
		}
	}

	/**
	 * Loop through the gridsquares and pass them to the addHtml method. If the tile includes an HTML structure it will be appended to the wrapper node and then the wrapper node will be appended to the document.
	 * @param {Obj} gridSquares 
	 * @return void
	 */
	htmlLoop(gridSquares) {
		return new Promise((resolve, reject) => {
			let wrap = document.getElementById('htmlwrap');

			if(wrap) { wrap.remove() };

			wrap = document.createElement('div');
			wrap.setAttribute('id','htmlwrap');

			gridSquares.forEach((row,i)=>{
				row.forEach((square,i)=>{
					this.addHtml(square,wrap);
				});
			});

			this.wrap.appendChild(wrap);

			let interval = setInterval(() => {
				if(document.getElementById('htmlwrap')) {
					clearInterval(interval);
					resolve();
				}
			},200);			
		});		
	}

	/**
	 * Add all the HTML items to the wrapper which will then be appended to the document
	 * @param {obj} square 
	 * @param {DOM Node} wrap 
	 * @return void
	 */
	addHtml(square, wrap) {
		const row = square.position.row;
		const col = square.position.col;
		const x = row % 2 === 0 ? colWidth * col : (colWidth * col) +  colWidth/2;
		const y = height - ((rowHeight / 2) * row) - rowHeight/2;

		if(square && square.brushes && square.brushes.html && html[square.brushes.html]) {
			let htmlObj = html[square.brushes.html];
			let el = htmlObj.template.cloneNode(true);
			el.removeAttribute('id');
			el.setAttribute('style',`position: absolute; left: ${x}px; bottom: ${y}px;`);
			wrap.appendChild(el);
		}
	}

	/**
	 * Select the gridsquares object from the current state
	 * @param {obj} state 
	 * @return void
	 */
	select(state) {
		return state.gridSquares;
	}

	/**
	 * Pause the animations
	 * @return void
	 */
	pause() {
		this.paused = true;
	}

	/**
	 * Unpause the animations
	 * @return void
	 */
	unpause() {
		this.paused = false;
	}

	/**
	 * Called when the subscriber is hit. Loops through the canvas selectors and does an equivalence check. If it fails that canvas is added to the render queue.
	 * @return void
	 */
	handleChange() {
		let state = this.store.getState();
		
		for(let prop in this.canvasTypes) {
			if(prop === 'animation' || prop === 'animationUnder') { return };

			let canvasGroup = this.canvasTypes[prop];
			let newVal = canvasGroup.selector(state);
			
			if(typeof canvasGroup.current === 'undefined' || !deepEqual(canvasGroup.current, newVal)) {				
				canvasGroup.queued = true;
				canvasGroup.current = _.cloneDeep(newVal);
			}
		}
	}
	
	/**
	 * Handle the dragscroll scroll event. call hide/show canvases and inform the animation handlers
	 * @return void
	 */
	handleScroll() {
		AnimationsUpdateDimensions();
		this.hideShowCanvases();
	}

	/**
	 * Hide canvases when they're outside the viewport and reveal them when they aren't!
	 */
	hideShowCanvases() {
		let allMembers = this.canvasTypesArray.map(group => {
			return group.members;
		});

		let hiddenMembers = this.canvasTypesArray.map(group => {
			return group.members.filter(canvas => {
				const bounding = canvas.getBoundingClientRect();

				return (
					bounding.left <= -bounding.width ||
					bounding.left >= window.innerWidth
				);
			});
		});

		allMembers.forEach(group => {
			group.forEach(canvas => {
				window.requestAnimationFrame(()=>{
					canvas.classList.contains('invisible') && canvas.classList.remove('invisible');
				});				
			});
		});

		hiddenMembers.length && hiddenMembers.forEach(group => {
			group.forEach(canvas => {
				window.requestAnimationFrame(()=>{
					!canvas.classList.contains('invisible') && canvas.classList.add('invisible');
				});		
			});			
		});
	}
}