import { colWidth as width, rowHeight as height } from '../../constants/dimensions';

export default class Square {
	constructor( { row, col }, id) {
		this.position = { row, col };
		this.brushes = { terrain: 1, structure: 0, structureUnder: 0, html: 0 };
	}
}