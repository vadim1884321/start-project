'use strict';

const fs = require("fs");
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();

// Разметка
const pug = () => {
  return gulp.src('app/pug/pages/**/*.pug')
    .pipe($.pug({
      locals : {
        nav: JSON.parse(fs.readFileSync('data/navigation.json', 'utf8')),
        content: JSON.parse(fs.readFileSync('data/content.json', 'utf8')),
        year: new Date().getFullYear()
      },
      pretty: true
    }))
    .on('error', $.notify.onError((error) => {
      return {
        title: 'Pug',
        message: error.message
      };
    }))
    .pipe($.replace('../../', './'))
    .pipe(gulp.dest('app/'))
    .on('end', browserSync.reload);
};

// Обработка стилей
const styles = () => {
  return gulp.src('app/sass/**/*.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({ outputStyle: 'expanded' }).on("error", $.notify.onError()))
    // .pipe($.purgecss({ content: ['app/*.html', 'app/js/**/*.js'] }))
    .pipe($.autoprefixer({
      overrideBrowserslist: ['last 2 versions', 'not dead'],
      grid: true
    }))
    .pipe($.groupCssMediaQueries())
    // .pipe($.cssnano())
    .pipe($.rename({ suffix: '.min', prefix: '' }))
    .pipe($.replace('../../', '../'))
    .pipe($.sourcemaps.write('/'))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream())
};

// Обработка скриптов
const scripts = () => {
  return gulp.src([
    // Подключаем JS библиотеки
    '!node_modules/picturefill/dist/picturefill.min.js',
    '!node_modules/object-fit-images/dist/ofi.min.js',
    'node_modules/svgxuse/svgxuse.min.js',
    '!node_modules/pixel-glass/script.js',
    'app/js/common.js', // Всегда в конце
  ])
    // .pipe($.terser())
    .pipe($.concat('main.min.js'))
    .pipe(gulp.dest('app/js/'))
    .on('end', browserSync.reload);
};

// Очистка папки c svg-спрайтом
const svgClean = () => {
  return gulp.src('app/images/svg-sprite/**/', {read: false})
    .pipe($.clean());
};

// Обработка SVG, создание svg-спрайта
const svgSprite = () => {
  return gulp.src('app/images/svg/**/*.svg')
    .pipe($.svgo({
      plugins: [
        { cleanupIDs: false },
        { removeViewBox: false },
        { convertPathData: false },
        { mergePaths: false }
      ]
    }))
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest('app/images/svg-sprite/'));
};

// Автоперезагрузка браузера (Live Server)
const serve = () => {
  browserSync.init({
    server: {
      baseDir: 'app',
    },
    notify: false,
    open: true,
    // online: false, // Work offline without internet connection
    // tunnel: true,
    // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
  });
  // browserSync.watch('app/*.html', browserSync.reload);
  gulp.watch('app/pug/**/*.pug', gulp.series(pug));
  gulp.watch('app/sass/**/*.scss', gulp.series(styles));
  gulp.watch('app/js/common.js', gulp.series(scripts));
  gulp.watch('app/images/svg/**/*.svg', gulp.series(svg));
};

const svg = gulp.series(svgClean, gulp.parallel(svgSprite));
const dev = gulp.series(gulp.parallel(pug, styles, scripts, svg, serve));

exports.pug = pug;
exports.styles = styles;
exports.scripts = scripts;
exports.svgClean = svgClean;
exports.svgSprite = svgSprite;
exports.serve = serve;
exports.default = dev;
