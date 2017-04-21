import { terrain } from '../application/constants/terrain';
import { structure } from '../application/constants/structure';
import { structureUnder } from '../application/constants/structureUnder';
import { animations } from '../application/constants/animations';

export const defaultState = {
	animations: [],
	assets: {
		terrain,
		structure,
		structureUnder,
		animations
	},
	gridSquares: [],
	settings: {
		activeBrush: {
			type: 'terrain',
			id: 0
		},
		builder: false,
		buildMode: false,
		animationMode: false,
		activeAnimationBrush: {
			id: null
		},
		debug: false
	}
}