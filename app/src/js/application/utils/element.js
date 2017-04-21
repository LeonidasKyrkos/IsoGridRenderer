export const createElement = (type='div', classes='', identifier='', extraAttrs=[]) => {
	let element = document.createElement(type);
	element.setAttribute('class',classes);
	element.setAttribute('data-js',identifier);
	extraAttrs.forEach((item,index)=>{
		element.setAttribute(item.name,item.val);
	});

	return element;
}

export const appendElement = (sources=[], destination={}, wrapType='div') => {
	if(!sources.length || !destination) { return };

	let wrap = document.createElement(wrapType);

	sources.forEach((el,index)=>{
		wrap.appendChild(el);
	});

	destination.appendChild(wrap);
}