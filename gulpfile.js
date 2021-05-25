'use strict';

const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlBeautify = require('gulp-html-beautify');
const sass = require('gulp-dart-sass');
const postcss = require('gulp-postcss');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const terser = require('gulp-terser');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const browserSync = require('browser-sync');

// Разметка
const nunjucks = () => {
  return gulp.src('src/_includes/pages/**/*.{html, njk}')
    .pipe(plumber())
    .pipe(nunjucksRender({
      path: [
        'src/_includes/'
      ],
      watch: true,
      envOptions: {
        trimBlocks: true,
        lstripBlocks: true
      },
      data : {
        nav: JSON.parse(fs.readFileSync('src/_data/navigation.json', 'utf8')),
        content: JSON.parse(fs.readFileSync('src/_data/content.json', 'utf8')),
        site: JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')),
        year: new Date().getFullYear()
      }
    }))
    .pipe(htmlBeautify())
    .pipe(replace('../../', './'))
    .pipe(gulp.dest('src/'))
    .pipe(browserSync.stream());
};

exports.nunjucks = nunjucks;

// Обработка стилей
const styles = () => {
  return gulp.src('src/scss/**/*.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss())
    .pipe(rename({ suffix: '.min', prefix: '' }))
    .pipe(replace('../../', '../'))
    .pipe(gulp.dest('src/css/', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
};

exports.styles = styles;

// Обработка скриптов
const scripts = () => {
  return gulp.src([
    // Подключаем JS библиотеки
    '!node_modules/pixel-glass/script.js',
    'src/js/common.js'
  ])
    // .pipe(terser())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('src/js/'))
    .pipe(browserSync.stream());
};

exports.scripts = scripts;

// Очистка папки c svg-спрайтом
const svgClean = () => {
  return del('src/images/svg-sprite/**/*', { force: true })
};

exports.svgClean = svgClean;

// Обработка SVG, создание svg-спрайта
const svgSprite = () => {
  return gulp.src('src/images/svg/**/*.svg')
    .pipe(svgmin({
      plugins: [
        { sortAttrs: true },
        { removeStyleElement: false },
        { removeScriptElement: false }
      ],
      js2svg: {
        indent: 2,
        pretty: true
      }
    }))
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('src/images/svg-sprite/'));
};

exports.svgSprite = svgSprite;

// Автоперезагрузка браузера (Live Server)
const serve = () => {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
    ui: false,
    notify: false,
    open: 'local',
    // tunnel: true,
    // tunnel: 'projectname', //Demonstration page: http://projectname.localtunnel.me
  });
  // browserSync.watch('src/*.html', browserSync.reload);
};

exports.serve = serve;

const watch = () => {
  gulp.watch('src/_includes/**/*.{html, njk}', gulp.series(nunjucks));
  gulp.watch('src/scss/**/*.scss', gulp.series(styles));
  gulp.watch('src/js/common.js', gulp.series(scripts));
  gulp.watch('src/images/svg/**/*.svg', gulp.series(svgClean, gulp.parallel(svgSprite)));
};

exports.watch = watch;

exports.default = gulp.series(
  gulp.parallel(
    nunjucks,
    styles,
    scripts,
    gulp.series(
      svgClean,
      gulp.parallel(
        svgSprite
      )
    )
  ),
  gulp.parallel(
    watch,
    serve
  )
);
