export const perfTest = (failCallback, n=0, time) => {
	let startTime = time || performance.now();

	if(n < 100) {
		window.requestAnimationFrame(()=>{
			perfTest(failCallback, n, time);
		});
	} else {
		let endTime = performance.now();
		let duration = (endTime - startTime) / 1000;

		duration > 2 && failCallback();
	}
}