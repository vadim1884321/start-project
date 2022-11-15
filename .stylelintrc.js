module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-rational-order', 'stylelint-config-prettier-scss'],
  plugins: ['stylelint-scss', 'stylelint-order'],
  rules: {
    indentation: 2,
    'string-quotes': 'single',
    'function-url-quotes': [
      'always',
      {
        except: 'empty',
      },
    ],
    'font-family-name-quotes': 'always-unless-keyword',
    'color-function-notation': 'legacy',
    'hue-degree-notation': 'number',
    'alpha-value-notation': 'number',
    'declaration-colon-newline-after': null,
    'no-descending-specificity': null,
    'selector-class-pattern': [
      '^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*)?(?:\\[.+\\])?$',
      {
        resolveNestedSelectors: true,
      },
    ],
    'scss/double-slash-comment-empty-line-before': 'never',
  },
}
