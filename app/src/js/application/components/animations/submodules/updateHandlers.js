 import { refreshRate } from '../../../constants/settings';
 import _ from 'lodash';
 import getAnimationImage from '../../../utils/getAnimationImage';

const dragscroll = document.getElementById('dragscroll');
const isoGrid = document.getElementById('isogrid');

let scrollX = dragscroll.scrollLeft;
let scrollY = dragscroll.scrollTop;
let winWidth = window.innerWidth;
let winHeight = window.innerHeight;
let isoX = isoGrid.offsetLeft;
let isoY = isoGrid.offsetTop;

export const updateDimensions = () => {
	scrollX = dragscroll.scrollLeft;
	scrollY = dragscroll.scrollTop;
}

// Animation handlers
export const updateAnimationHandler = (state, images) => {
	const elapsed = performance.now()/1000;
	if(!state.animations) { return };
	Object.keys(state.animations).forEach( name => {
		updateAnimation(state.animations[name], elapsed, images)
	});
}

const updateAnimation = (animation, elapsed, images) => {
	animation.finished = animation.finished || elapsed;
	animation.active = handleDelay(animation,elapsed);

	if(!animation.active) { return };

	animation.remainingCoordinates = animation.remainingCoordinates || Object.assign([],animation.allCoordinates);
	
	if(animation.remainingCoordinates.length > 1) {
		animation.currentCoordinates = getNextCoordinates(animation);
		animation.direction = getDirectionOfTravel(animation.remainingCoordinates[0],animation.remainingCoordinates[1]);
		updateVisibility(animation, images);
	} else {
		resetAnimation(animation);
	}
}

const getNextCoordinates = (animation) => {
	let currentCoordinates = animation.currentCoordinates || animation.remainingCoordinates[0];
	let origin = animation.remainingCoordinates[0];
	let destination = animation.remainingCoordinates[1];
	animation.vector = animation.vector || getVector(origin, destination, animation.speed);

	if((animation.vector.xLength < 0 && currentCoordinates.x <= destination.x || animation.vector.xLength > 0 && currentCoordinates.x >= destination.x) && (animation.vector.yLength < 0 && currentCoordinates.y <= destination.y || animation.vector.yLength > 0 && currentCoordinates.y >= destination.y) || ((animation.vector.xLength === 0 && animation.vector.yLength < 0 && currentCoordinates.y <= destination.y) || (animation.vector.xLength === 0 && animation.vector.yLength > 0 && currentCoordinates.y >= destination.y)) || ((animation.vector.yLength === 0 && animation.vector.xLength < 0 && currentCoordinates.x <= destination.x) || (animation.vector.yLength === 0 && animation.vector.xLength > 0 && currentCoordinates.x >= destination.x))) {
		animation.remainingCoordinates.splice(0,1);
		animation.previousDirection = animation.direction;
		delete animation.vector;
		return animation.remainingCoordinates[0];
	}

	return { x: currentCoordinates.x + animation.vector.incrementX, y: currentCoordinates.y + animation.vector.incrementY };
}

const getVector = (origin, destination, speed) => {
	let vector = {};

	vector.xLength = origin.x < destination.x ? destination.x - origin.x : -origin.x + destination.x;
	vector.yLength = origin.y < destination.y ? destination.y - origin.y : -origin.y + destination.y;
	vector.length = Math.sqrt((vector.xLength * vector.xLength) + (vector.yLength * vector.yLength));

	const incrementPercentage = (speed / (1000 / refreshRate) / (vector.length));
	
	vector.incrementX = vector.xLength * incrementPercentage;
	vector.incrementY = vector.yLength * incrementPercentage;

	return vector;
}

const resetAnimation = (animation,elapsed) => {
	delete animation.remainingCoordinates;
	delete animation.currentCoordinates;
	if(animation.vector) { delete animation.vector };
	animation.delay = false;
	animation.finished = elapsed;
	animation.visible = false;
}

const getDirectionOfTravel = (origin, destination) => {
	if(origin && destination) {
		let y = origin.y < destination.y ? 'S' : 'N';
		let x = origin.x < destination.x ? 'E' : 'W';

		return y+x;
	} else {
		return 'SE';
	}	
}

const handleDelay = (animation,elapsed) => {
	if(!animation.delay) {
		return true;
	}

	if(animation.delay < elapsed - animation.finished) {
		return true;
	} else {
		return false;
	}
}

const updateVisibility = (animation, images) => {
	const x = animation.currentCoordinates.x + isoX;
	const y = animation.currentCoordinates.y + isoY;	
	const image = getAnimationImage(images,animation.type,animation.direction);

	if(x + image.width > scrollX && x - image.width < scrollX + winWidth && y + image.height > scrollY && y - image.height < scrollY + winHeight) {
		animation.visible = true;
	} else {
		animation.visible = false;
	}
}