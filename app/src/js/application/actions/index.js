export const ADD_SQUARES = 'ADD_SQUARES';
export const UPDATE_SQUARE_TERRAIN = 'UPDATE_SQUARE_TERRAIN';
export const ADD_TERRAIN = 'ADD_TERRAIN';
export const CHANGE_BRUSH = 'CHANGE_BRUSH';
export const ADD_ANIMATION = 'ADD_ANIMATION';
export const UPDATE_ANIMATIONS = 'UPDATE_ANIMATIONS';
export const UPDATE_ANIMATION_MODE = 'UPDATE_ANIMATION_MODE';
export const UPDATE_ANIMATION_BRUSH = 'UPDATE_ANIMATION_BRUSH';
export const UPDATE_BUILD_MODE = 'UPDATE_BUILD_MODE';

export const addSquares = (squares) => {
	return {
		type: ADD_SQUARES,
		squares
	}
}

export const updateSquareTerrain = ({ col, row, brushType, brushID }) => {
	return {
		type: UPDATE_SQUARE_TERRAIN,
		data: {
			col,
			row,
			brushType,
			brushID			
		}
	}
}

export const addTerrain = (imageSrc) => {
	return {
		type: ADD_TERRAIN,
		imageSrc: imageSrc
	}
}

export const changeBrush = ({ type, id }) => {
	return {
		type: CHANGE_BRUSH,
		brush: { type, id }
	}
}

export const addAnimation = (animation) => {
	return {
		type: ADD_ANIMATION,
		payload: animation
	}
}

export const updateAnimations = (payload) => {
	return {
		type: UPDATE_ANIMATIONS,
		payload
	}
}

export const updateAnimationMode = (bool) => {
	return {
		type: UPDATE_ANIMATION_MODE,
		payload: bool
	}
}

export const updateAnimationBrush = (id) => {
	return {
		type: UPDATE_ANIMATION_BRUSH,
		payload: id
	}
}

export const updateBuildMode = (bool) => {
	return {
		type: UPDATE_BUILD_MODE,
		payload: bool
	}
}