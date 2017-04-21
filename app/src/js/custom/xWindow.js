export const newWindowfyLinks = () => {
	const externalLinks = [].slice.call(document.querySelectorAll('a')).filter((el)=>{
		return el.href.substring(0,4) === 'http';
	});;

	externalLinks.forEach(init);
}

const init = (el, i) => {
	el.addEventListener('click',handleClick);
}

const handleClick = (e) => {
	e.preventDefault();
	const target = e.currentTarget.href;
	window.open(target,'newWindow')
}