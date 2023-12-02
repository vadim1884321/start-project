// Back to top
const target = document.querySelector('.advantages');

const scrollToTopBtn = document.querySelector('.back-to-top');
const rootElement = document.documentElement;

function callback(entries) {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			scrollToTopBtn.classList.add('back-to-top--show');
		} else {
			scrollToTopBtn.classList.remove('back-to-top--show');
		}
	});
}

function scrollToTop() {
	rootElement.scrollTo({
		top: 0,
		behavior: 'smooth',
	});
}

scrollToTopBtn.addEventListener('click', scrollToTop);

let observer = new IntersectionObserver(callback);

observer.observe(target);
