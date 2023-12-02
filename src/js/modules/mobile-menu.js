// Mobile Menu
function toggleNav() {
	// Toggle menu
	const menuBtn = document.querySelector('.main-navigation__button');
	const menuItems = document.querySelector('.main-navigation__list');

	menuBtn?.addEventListener('click', () => {
		const menuExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
		menuBtn.setAttribute('aria-expanded', menuExpanded ? 'false' : 'true');
		menuBtn.setAttribute('aria-label', menuExpanded ? 'Open Menu' : 'Close Menu');
		menuItems?.classList.toggle('main-navigation__list--is-show');
	});
}

toggleNav();
