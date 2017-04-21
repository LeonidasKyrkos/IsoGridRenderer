/**
 * Set up type objects for our canvas groups with associated methods for updating
 * @return {obj} canvas types
 */
export const setupCanvasTypes = (context) => {
	const types = {
		terrain: {
			init: () => {
				context.canvasTypes.terrain.getMembers();
			},
			id: 'terrain',
			getMembers: () => {
				context.canvasTypes.terrain.members = [].slice.call(document.querySelectorAll('[data-js="canvas.group"][data-canvas-type="terrain"] > .canvas'));
			},
			selector: (state) => {
				return state.gridSquares;
			},
			parent: document.querySelector('[data-canvas-type="terrain"]'),
			render: (gridSquares) => {
				if(!context.canvasTypes.terrain.members) { return };

				renderLoop(context, gridSquares, 'terrain');
			}
		},
		animationUnder: {
			init: () => {
				context.canvasTypes.animationUnder.getMembers();
			},
			id: 'animationUnder',
			getMembers: () => {
				context.canvasTypes.animationUnder.members = [].slice.call(document.querySelectorAll('[data-js="canvas.group"][data-canvas-type="animation.under"] > .canvas'));
			},
			selector: (state) => {
				return state.animations.filter(animation => animation.zIndex === 0);
			},
			parent: document.querySelector('[data-canvas-type="animation.under"]'),
			render: (gridSquares) => {
				if(!context.canvasTypes.animationUnder.members) { return };

				renderLoop(context, gridSquares, 'animationUnder');
			}
		},
		structureUnder: {
			init: () => {
				context.canvasTypes.structureUnder.getMembers();
			},
			id: 'structureUnder',
			getMembers: () => {
				context.canvasTypes.structureUnder.members = [].slice.call(document.querySelectorAll('[data-js="canvas.group"][data-canvas-type="structure.under"] > .canvas'));
			},
			selector: (state) => {
				return state.gridSquares.map(row => {
					return row.filter(square => square.brushes.structureUnder > 0);
				});
			},
			parent: document.querySelector('[data-canvas-type="structure.under"]'),
			render: (gridSquares) => {
				if(!context.canvasTypes.structureUnder.members) { return };

				renderLoop(context, gridSquares, 'structureUnder');
			}
		},
		animation: {
			init: () => {
				context.canvasTypes.animation.getMembers();
			},
			id: 'animation',
			getMembers: () => {
				context.canvasTypes.animation.members = [].slice.call(document.querySelectorAll('[data-js="canvas.group"][data-canvas-type="animation"] > .canvas'));
			},
			selector: (state) => {
				return state.animations.filter(animation => animation.zIndex > 0);
			},
			parent: document.querySelector('[data-canvas-type="animation"]'),
			render: (gridSquares) => {
				if(!context.canvasTypes.animation.members) { return };

				renderLoop(context, gridSquares, 'animation');
			}
		},
		structure: {
			init: () => {
				context.canvasTypes.structure.getMembers();
			},
			id: 'structure',
			getMembers: () => {
				context.canvasTypes.structure.members = [].slice.call(document.querySelectorAll('[data-js="canvas.group"][data-canvas-type="structure"] > .canvas'));
			},
			selector: (state) => {
				return state.gridSquares.map(row => {
					return row.filter(square => square.brushes.structure > 0);
				});
			},
			parent: document.querySelector('[data-canvas-type="structure"]'),
			render: (gridSquares) => {
				if(!context.canvasTypes.structure.members) { return };

				renderLoop(context, gridSquares, 'structure');
			}
		},
	}

	return types;
}

/**
 * Rendering loop handler for all canvas types
 * @param {Obj} context
 * @param {DOM node} canvas 
 * @param {array} gridSquares 
 * @param {string} type 
 */
const renderLoop = (context, gridSquares, type) => {
	context.canvasTypes[type].members.forEach(canvas => {
		const rows = filterGridSquares(gridSquares, canvas);

		drawSquares(context, canvas, rows, type);
	});
}

/**
 * Clear the canvas and then loop through the provided rows and draw the tiles with the appropriate type
 * @param {DOM Node} canvas 
 * @param {Obj} gridSquares 
 * @param {String} type 
 * @return void
 */
const drawSquares = (context, canvas, gridSquares, type) => {
	const ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	gridSquares.forEach((row,i)=>{
		row.forEach((square,i)=>{
			context.drawGridSquare(canvas, square, type);
		});
	});
}

/**
 * Filter the provided arrays based on the canvas row and column values. The grid is split into six render sections.
 * @param {arr} rows 
 * @param {int} row 
 * @param {int} col 
 * @return {arr} filtered gridSquare rows
 */
const filterGridSquares = (rows, canvas) => {
	const row = parseInt(canvas.getAttribute('data-row'));
	const col = parseInt(canvas.getAttribute('data-col')) + 1;

	return rows.filter((rowItem, index) => {		
		rowItem = rowItem.filter(square => square.position.col <= (rowItem.length * 0.3) * col && square.position.col >= (rowItem.length * 0.3) * (col - 1));

		if(row === 0) {
			return index <= Math.floor(rows.length / 2) + 2;
		} else {
			return index >= Math.floor(rows.length / 2) -2;
		}
	});
}