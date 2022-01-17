'use strict';
console.log(sum());

const fs = require('fs');
const { src, dest } = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const plumber = require('gulp-plumber');
const htmlBeautify = require('gulp-html-beautify');
const replace = require('gulp-replace');

const nunjucks = () => {
  return src('src/_includes/pages/**/*.{html,njk}')
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: [
        'src/_includes/'
      ],
      envOptions: {
        trimBlocks: true,
        lstripBlocks: true
      },
      data: {
        nav: JSON.parse(fs.readFileSync('src/_data/navigation.json', 'utf8')),
        site: JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')),
        year: new Date().getFullYear()
      }
    }))
    .pipe(htmlBeautify())
    .pipe(replace('../../', './'))
    .pipe(dest('src/'));
};

exports.nunjucks = nunjucks;

function sum() {
  return 12;
}

const sum2 = (a) => `Привет, ${a}!`;

console.log(sum());
console.log(sum2('Вадим'));
console.log(sum2('Марина'));

let x = 12;

console.log(x);
