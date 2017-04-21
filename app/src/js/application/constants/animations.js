// part of state.assets
export const animations = [
	{
		type: 'flare',
		offsetY: 0,
		offsetX: 0,
		speed: 200,
		delay: 0,
		zIndex: 1,
		images: {
			SE: {
				imageSrc: "/assets/flare.png"
			},
			SW: {
				imageSrc: "/assets/flare.png"
			},
			NW: {
				imageSrc: "/assets/flare.png"
			},
			NE: {
				imageSrc: "/assets/flare.png"
			}
		}
	},
	{
		type: 'car',
		offsetY: -15,
		offsetX: 0,
		speed: 200,
		delay: 0,
		zIndex: 1,
		images: {
			SE: {
				imageSrc: "/assets/car_se.png"
			},
			SW: {
				imageSrc: "/assets/car_sw.png"
			},
			NW: {
				imageSrc: "/assets/car_nw.png"
			},
			NE: {
				imageSrc: "/assets/car_ne.png"
			}
		}
	},
	{
		type: 'boat',
		offsetY: 3,
		offsetX: 0,
		speed: 200,
		delay: 0,
		zIndex: 0,
		images: {
			SE: {
				imageSrc: "/assets/boat_se.png"
			},
			SW: {
				imageSrc: "/assets/boat_sw.png"
			},
			NW: {
				imageSrc: "/assets/boat_nw.png"
			},
			NE: {
				imageSrc: "/assets/boat_ne.png"
			}
		}
	}
]