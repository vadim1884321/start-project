import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay, Scrollbar, Parallax, EffectFade } from 'swiper/modules';

new Swiper('.home-slider', {
	modules: [Navigation, Pagination, Autoplay, Scrollbar, Parallax, EffectFade],
	speed: 800,
	effect: 'fade',
	centeredSlides: true,
	pagination: {
		el: '.home-slider__pagination',
		type: 'custom',
		renderCustom: function (swiper, current, total) {
			let indT = total >= 10 ? total : `0${total}`;
			let indC = current >= 10 ? current : `0${current}`;
			return `<b>${indC}</b><span></span> ${indT}`;
		},
	},
	scrollbar: {
		el: '.home-siler__scrollbar',
		draggable: true,
	},
	navigation: {
		prevEl: '.home-slider__prev',
		nextEl: '.home-slider__next',
	},
	keyboard: {
		enabled: true,
		onlyInViewport: false,
	},
	runCallbacksOnInit: true,
});

new Swiper('.advantages-slider', {
	modules: [Autoplay, EffectFade],
	effect: 'fade',
	speed: 1400,
	autoplay: {
		delay: 3000,
		disableOnInteraction: false,
	},
});
