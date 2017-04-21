const requestFullScreen = () => {
	if(document.documentElement.requestFullScreen) {
		document.documentElement.requestFullScreen();
	} else if(document.documentElement.webkitRequestFullScreen) {
		document.documentElement.webkitRequestFullScreen();
	}
}

const removeListener = () => {
	window.removeEventListener('click',requestFullScreen);
}

export const init = () => {
	if(window.innerWidth <= 800) { window.addEventListener('click',requestFullScreen) };
	window.addEventListener('resize', removeListener);
}