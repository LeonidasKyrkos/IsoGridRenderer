import { rows, cols, cvWidth as width, cvHeight as height } from '../constants/dimensions';
import { getSquarePoints } from './getSquarePoints';
import { updateSquareTerrain } from '../actions';

export const findSquare = (eventX,y,store) => {
	const x = eventX - window.innerWidth;
	const col = Math.floor(cols * (x/ width));
	const row = Math.floor(rows * (y / height));
	const state = store.getState();
	let squares = [];
	let square;

	for(let r = row - 1; r <= row + 1; r++) {
		for(let c = col - 1; c <= col + 1; c++) {			
			if(row >= 0 && row < rows && col >= 0 && col <= cols) {				
				if(state.gridSquares[r] && state.gridSquares[r][c]) {
					squares.push(state.gridSquares[r][c]);
				}				
			}			
		}
	}

	squares.some((testSquare) => {
		let test = inPoly(getSquarePoints(testSquare), { x, y } );

		if(test) {
			square = testSquare;
			return true; 
		}
	});

	return square;
}

const inPoly = (polygon={}, { x, y }) => {
	let left = polygon['1'];
	let top = polygon['2'];
	let right = polygon['3'];
	let bottom = polygon['4'];

	if(x >= left.x && x <= right.x && y >= top.y && y <= bottom.y) {
		return inTriangle(x,y,left.x,left.y,top.x,top.y,right.x,right.y) || inTriangle(x,y,left.x,left.y,bottom.x,bottom.y,right.x,right.y);
	}
	
	return false;
}

const inTriangle = (px,py,ax,ay,bx,by,cx,cy) => {
	var v0 = [cx-ax,cy-ay];
	var v1 = [bx-ax,by-ay];
	var v2 = [px-ax,py-ay];

	var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
	var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
	var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
	var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
	var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

	var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

	var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
	var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

	return ((u >= 0) && (v >= 0) && (u + v < 1));
}



export default inTriangle;