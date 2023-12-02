/** @type {import("stylelint").Config} */
export default {
	extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-config-prettier-scss'],
	plugins: ['stylelint-scss'],
	rules: {
		'at-rule-no-unknown': null,
		'no-descending-specificity': null,
		'color-function-notation': 'legacy',
		'hue-degree-notation': 'number',
		'alpha-value-notation': 'number',
		'selector-class-pattern': [
			'^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
			{
				severity: 'warning',
				resolveNestedSelectors: true,
			},
		],
	},
	ignoreFiles: ['**/node_modules/**'],
};
