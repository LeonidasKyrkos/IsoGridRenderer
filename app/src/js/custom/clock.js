let previousTime = {};

export const clockHandler = () => {
	const clocks = {
		hour: [].slice.call(document.querySelectorAll('[data-js="bigben.hours"]')),
		minute: [].slice.call(document.querySelectorAll('[data-js="bigben.minutes"]'))
	}

	updateClocks(clocks);
	loop(clocks);
}

const loop = (clocks) => {
	window.requestAnimationFrame(() => {
		updateClocks(clocks);
		loop(clocks);
	});
}

/**
 * returns { hours, minutes }
 */
const getTime = () => {
	const date = new Date();
	const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours().toString();
	const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes().toString();
	const seconds = date.getSeconds().toString();

	return {
		hours,
		minutes,
		seconds
	}
}

const updateClocks = (clocks) => {
	let time = getTime();

	if(time.hours !== previousTime.hours) {
		clocks.hour.length && clocks.hour.forEach(el => {
			el.textContent = time.hours;
		});
		
		previousTime.hours = time.hours;
	}

	if(time.minutes !== previousTime.minutes) {
		clocks.minute.length && clocks.minute.forEach(el => {
			el.textContent = time.minutes;
		})

		previousTime.minutes = time.minutes;
	}
}