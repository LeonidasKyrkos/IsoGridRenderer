/**
 * Receives an array of images, an animation type and an animation direction. Returns the associated image from the array.
 * @param {arr} images 
 * @param {Number} animation type
 * @param {String} animation direction
 * @return {dom node}
 */

const getAnimationImage = (images=[], type, direction) => {
	if(images.length && type && direction) {
		return images[type].images[direction].image;
	}
}

export default getAnimationImage;