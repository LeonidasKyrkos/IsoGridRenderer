import _ from 'lodash';

export const instantiateImages = (list) => {
	return new Promise((resolve,reject)=>{
		let promises = [];
		let images = {};

		list.forEach((image,index) => {
			if(image.imageSrc) {
				let promise = new Promise((resolve, reject)=>{
					let el = new Image();
					el.src = image.imageSrc;
					images[index] = {
						...image,
						image: el
					};

					el.addEventListener('load',(e)=>{
						resolve();
					});					
				});

				promises.push(promise);
			}			
		});

		Promise.all(promises).then(()=>{
			resolve(images);
		});
	});		
}

export const instantiateAnimationImages = (animationsState) => {
	return new Promise((resolve,reject)=>{
		let animations = _.cloneDeep(animationsState);
		let promises = [];

		animations.map( animation => {
			Object.keys(animation.images).map( key => {
				let image = animation.images[key];
				
				if(image.imageSrc) {
					let promise = new Promise((resolve, reject)=>{
						let el = new Image();
						el.src = image.imageSrc;
						animation.images[key] = {
							...image,
							image: el
						};

						el.addEventListener('load',(e)=>{
							resolve();
						});					
					});

					promises.push(promise);
				}
			});
		});

		Promise.all(promises).then(()=>{
			resolve(animations);
		});
	});
}