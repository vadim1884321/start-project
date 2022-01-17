!(function () {

	/**
 * Случайное число в диапазоне от min до max
 * @param {number} min минимальное число
 * @param {number} max максимальное число
 * @returns {number} случайное число в укзанном диапазоне
 */

	function randomInteger(min, max) {
		try {
			if (!Number.isInteger(min) || !Number.isInteger(max))
				throw new TypeError('Параметр функции должен быть числом');
			return Math.floor(min + Math.random() * (max + 1 - min));
		} catch (error) {
			alert(error);
		}

	}

	alert(randomInteger(1, 10));
}());
