import _ from 'lodash';
import { addAnimation, updateAnimationBrush, updateAnimationMode } from '../../actions';
import { refreshRate } from '../../constants/settings';
import { instantiateImages } from '../../utils/instantiateImages';
import { createElement } from '../../utils/element';
import { getCentreOfSquare } from '../../utils/square';
import { findSquare } from '../../utils/findSquare';
import newAnimation from './submodules/Animation';
import deepEqual from 'deep-equal';
import { defaults } from '../../constants/animations';

export default class AnimationPalette {
	constructor(store) {
		this.store = store;
		this.wrap = document.getElementById('isogrid');
		this.runSelectors();
		this.store.subscribe(this.handleChanges.bind(this));

		this.init();
	}

	init() {
		this.animatables = document.querySelector('[data-js="animationMode.animatables"]');
		this.flag = new Image();
		this.flag.src = '/assets/flag.png';

		const promise = new Promise((resolve, reject) => {
			this.createAnimatables(resolve);
		});

		promise.then(() => {
			this.inputs = this.inputSelectors();
			this.elementSelectors();
			this.ctx = this.canvas.getContext('2d');
			this.eventHandlers();
			this.handleChanges();
		})
	}

	render() {
		this.showTools();
	}

	destroy() {
		this.hideTools();
	}

	showTools() {
		this.animationTools.classList.remove('hide');
	}

	hideTools() {
		this.clearPalette();
		this.animationTools.classList.add('hide');
	}

	addAnimation() {
		let animation = new Animation();
		this.store.dispatch(addAnimation(animation));
	}

	inputSelectors() {
		return {
			speed: document.querySelector('[data-js="animation.speed"]'),
			delay: document.querySelector('[data-js="animation.delay"]'),
			offsetX: document.querySelector('[data-js="animation.offset.x"]'),
			offsetY: document.querySelector('[data-js="animation.offset.y"]')
		}
	}

	runSelectors() {
		let state = this.store.getState();

		this.selectors = {
			buildMode: state.settings.buildMode,
			animationMode: state.settings.animationMode,
			animationInstances: state.animations,
			animationArchetypes: state.assets.animations,
			activeAnimationBrush: state.settings.activeAnimationBrush
		}
	}

	elementSelectors() {
		this.animationTools = document.querySelector('[data-js="animationMode"]');
		this.newAnimationButton = document.querySelector('[data-js="animationMode.new"]');
		this.saveAnimationButton = document.querySelector('[data-js="animationMode.save"]');
		this.cancelAnimationButton = document.querySelector('[data-js="animationMode.cancel"]');
		this.paletteItems = [].slice.call(document.querySelectorAll('[data-js="animationMode.paletteItem"]'));
		this.form = [].slice.call(document.querySelectorAll('[data-js="animationMode.settings"]'));
		this.canvas = document.querySelector('[data-js="isogrid.canvas"][data-canvas="animation.over"]');
	}

	handleChanges() {
		this.runSelectors();
		
		if(typeof this.oldSelectors === 'undefined' || this.oldSelectors.buildMode !== this.selectors.buildMode || this.oldSelectors.animationMode !== this.selectors.animationMode) {
			this.destroy();

			if(this.selectors.buildMode && this.selectors.animationMode) {
				
				this.render();
			}
		}

		this.oldSelectors = _.cloneDeep(this.selectors);
	}

	createAnimatables(resolve, reject) {
		let images = this.selectors.animationArchetypes.map(archetype => {
			const firstImage = Object.keys(archetype.images)[0];
			return archetype.images[firstImage];
		});

		let animatables = instantiateImages(images);

		animatables.then( animatables => {
			this.animatableItems = animatables;
			this.renderAnimatables();
			resolve();
		});
	}

	renderAnimatables() {
		for(let name in this.animatableItems) {
			let ani = this.animatableItems[name];
			let wrap = createElement('li');
			let el = createElement('img','control-panel__item','animationMode.paletteItem',[
				{ name: 'src', val: ani.imageSrc },
				{ name: 'data-id', val: name}
			]);

			wrap.appendChild(el);
			this.animatables.appendChild(wrap);
		}
	}

	eventHandlers() {
		this.paletteItems.forEach(this.paletteHandler.bind(this));
		this.wrap.addEventListener('click',this.canvasClickHandler.bind(this));
		this.saveAnimationButton.addEventListener('click',this.onSave.bind(this));
		this.cancelAnimationButton.addEventListener('click',this.closePalette.bind(this));
	}

	canvasClickHandler(e) {
		this.runSelectors();

		if(this.selectors.animationMode && this.selectors.activeAnimationBrush !== null) {
			const x = e.x + this.wrap.parentNode.scrollLeft;
			const y = e.y + this.wrap.parentNode.scrollTop;
			const square = findSquare(x, y, this.store);
			
			if(square) {				
				this.animationEditHandler(square);
			}
		}
	}

	animationEditHandler(square) {
		let aniObj = this.selectors.activeAnimationBrush;

		if(this.drawingAni) {
			this.addToExistingAnimationPath(square);
		} else {
			this.createNewAnimationPath(square);
		}
	}

	createNewAnimationPath(square) {
		let archetype = this.selectors.animationArchetypes[this.selectors.activeAnimationBrush];

		this.drawingAni = Object.assign({},archetype,{
			type: this.selectors.activeAnimationBrush,
			allCoordinates: [getCentreOfSquare(square)]
		});

		this.addFlag();
	}

	addToExistingAnimationPath(square) {
		this.drawingAni.allCoordinates.push(getCentreOfSquare(square));

		this.addFlag();
	}

	onSave() {
		if(this.drawingAni) {
			Object.keys(this.inputs).map( key => {
				let option = this.inputs[key];

				if(option && option.value.length) {
					this.drawingAni[key] = parseInt(option.value)
				}
			})

			this.store.dispatch(addAnimation(this.drawingAni));
			this.closePalette();
		}
	}

	paletteHandler(el) {
		el.addEventListener('click',this.paletteClickHandler.bind(this));
	}

	paletteClickHandler(e) {
		this.clearPalette();
		let target = e.currentTarget;
		let animationID = target.getAttribute('data-id');
		target.classList.add('active');

		this.store.dispatch(updateAnimationBrush(animationID));
	}

	clearPalette() {
		this.paletteItems.forEach( el => {
			el.classList.remove('active');
		})
	}

	closePalette() {
		this.store.dispatch(updateAnimationBrush(null));
		this.store.dispatch(updateAnimationMode(false));
		delete this.drawingAni;
		this.emptyForm();
		this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
	}

	emptyForm() {
		let inputs = [].slice.call(document.querySelectorAll('[data-js="animationMode.settings"] input'));
		inputs.forEach(element => {
			element.value = '';
		});
	}

	addFlag() {
		this.ctx.drawImage(this.flag,this.drawingAni.allCoordinates[this.drawingAni.allCoordinates.length - 1].x,this.drawingAni.allCoordinates[this.drawingAni.allCoordinates.length - 1].y - this.flag.height);
	}
}