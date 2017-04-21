import { colWidth, rowHeight } from '../constants/dimensions';

export const getSquarePoints = (square) => {
		const row = square.position.row;
		const col = square.position.col;
		const width = colWidth;
		const height = rowHeight;

		const x1 = row % 2 === 0 ? width * col : (width * col) +  width/2;
		const x2 = x1 + (width/2);
		const x3 = x1 + width;
		const x4 = x2;
		const y1 = ((height / 2) * row) + height/2;
		const y2 = y1 - height/2;
		const y3 = y1;
		const y4 = y2 + height;

		return {
			1: {
				x: x1,
				y: y1
			},
			2: {
				x: x2,
				y: y2
			},
			3: {
				x: x3,
				y: y3
			},
			4: {
				x: x4,
				y: y4
			},
			5: {
				x: x1,
				y: y1
			}
		}
	}