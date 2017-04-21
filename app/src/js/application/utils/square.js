import { colWidth, rowHeight } from '../constants/dimensions';

export const getCentreOfSquare = (square) => {
	if(square.position.row % 2 === 0) {
		var x = (square.position.col * colWidth) + (colWidth/2);
	} else {
		var x = (square.position.col * colWidth) + (colWidth/2) + (colWidth/2);
	}

	let y = (square.position.row * rowHeight/2) + rowHeight/2;

	return { x, y };
}