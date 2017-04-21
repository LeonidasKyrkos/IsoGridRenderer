export const getScrollSettings = (name, offsetY) => {
	if(window.innerWidth > 1600) {
		return bigDesktop(name, offsetY);
	}

	if(window.innerWidth < 600) {
		return mobile(name, offsetY);
	}

	return mediumDesktop(name, offsetY);
}

const getDefault = () => {
	const paddingX = document.getElementById('sidepanels').offsetWidth;
	return { x: paddingX, y: 300 };
}

const bigDesktop = (name, offsetY) => {	
	const defaultOffset = getDefault();

	switch(name) {		
		case 'eye':
			return { x: -300, y: offsetY };
		case 'tower-bridge':
			return { x: -450, y: offsetY };
		case 'shard':
			return { x: -300, y: offsetY };
		case 'battersea':
			return { x: -390, y: offsetY };
		case 'tate-modern':
			return { x: -470, y: offsetY };
		case 'o2':
			return { x: -400, y: offsetY };
		case 'kew':
			return { x: -400, y: offsetY };
		case 'big-ben':
			return { x: -300, y: offsetY };
		default: 
			return defaultOffset;
	}
}

const mediumDesktop = (name, offsetY) => {
	const defaultOffset = getDefault();

	switch(name) {		
		case 'eye':
			return { x: -300, y: offsetY };
		case 'tower-bridge':
			return { x: -450, y: offsetY };
		case 'shard':
			return { x: -300, y: offsetY };
		case 'battersea':
			return { x: -390, y: offsetY };
		case 'tate-modern':
			return { x: -470, y: offsetY };
		case 'o2':
			return { x: -400, y: offsetY };
		case 'kew':
			return { x: -400, y: offsetY };
		case 'big-ben':
			return { x: -300, y: offsetY };
		default: 
			return defaultOffset;
	}
}

const smallDesktop = (name, offsetY) => {
	const defaultOffset = getDefault();

	switch(name) {		
		case 'eye':
			return { x: -750, y: offsetY };
		case 'tower-bridge':
			return { x: -600, y: offsetY };
		case 'shard':
			return { x: -550, y: offsetY };
		case 'battersea':
			return { x: -933, y: offsetY };
		case 'tate-modern':
			return { x: -800, y: offsetY };
		case 'o2':
			return { x: -400, y: offsetY };
		case 'kew':
			return { x: -1050, y: offsetY };
		case 'big-ben':
			return { x: -780, y: offsetY };
		default: 
			return defaultOffset;
	}
}

const mobile = (name, offsetY) => {
	const defaultOffset = getDefault();

	switch(name) {		
		case 'eye':
			return { x: -1450, y: offsetY - 100};
		case 'tower-bridge':
			return { x: -900, y: offsetY + window.innerHeight/2 };
		case 'shard':
			return { x: -950, y: offsetY };
		case 'battersea':
			return { x: -1833, y: offsetY + 100 };
		case 'tate-modern':
			return { x: -1400, y: offsetY };
		case 'o2':
			return { x: -400, y: offsetY + window.innerHeight/2 };
		case 'kew':
			return { x: -2200, y: offsetY };
		case 'big-ben':
			return { x: -1500, y: offsetY - 100 };
		default: 
			return defaultOffset;
	}
}