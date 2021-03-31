'use strict';

const fs = require('fs');
const del = require('del');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();

// Разметка
const nunjucks = () => {
  return gulp.src('src/_includes/pages/**/*.+(html|njk)')
    .pipe($.nunjucksRender({
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
    .on('error', $.notify.onError((error) => {
      return {
        title: 'Nunjucks',
        message: error.message
      };
    }))
    .pipe($.htmlBeautify())
    .pipe($.replace('../../', './'))
    .pipe(gulp.dest('src/'))
    .on('end', browserSync.reload);
};

// Обработка стилей
const styles = () => {
  return gulp.src('src/scss/**/*.scss', { sourcemaps: true })
    .pipe($.dartSass({ outputStyle: 'expanded' }).on('error', $.notify.onError()))
    .pipe($.postcss())
    .pipe($.rename({ suffix: '.min', prefix: '' }))
    .pipe($.replace('../../', '../'))
    .pipe(gulp.dest('src/css/', { sourcemaps: '.' }))
    .pipe(browserSync.stream())
};

// Обработка скриптов
const scripts = () => {
  return gulp.src([
    // Подключаем JS библиотеки
    '!node_modules/pixel-glass/script.js',
    'src/js/common.js', // Всегда в конце
  ])
    // .pipe($.terser())
    .pipe($.concat('main.min.js'))
    .pipe(gulp.dest('src/js/'))
    .on('end', browserSync.reload);
};

// Очистка папки c svg-спрайтом
const svgClean = () => {
  return del('src/images/svg-sprite/**/*', { force: true })
};

// Обработка SVG, создание svg-спрайта
const svgSprite = () => {
  return gulp.src('src/images/svg/**/*.svg')
    .pipe($.svgmin({
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
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest('src/images/svg-sprite/'));
};

// Автоперезагрузка браузера (Live Server)
const serve = () => {
  browserSync.init({
    server: {
      baseDir: 'src',
    },
    ui: false,
    notify: false,
    open: 'local',
    online: false
    // tunnel: true,
    // tunnel: 'projectname', //Demonstration page: http://projectname.localtunnel.me
  });
  // browserSync.watch('app/*.html', browserSync.reload);
};

const watch = () => {
  gulp.watch('src/_includes/**/*.html', gulp.series(nunjucks));
  gulp.watch('src/scss/**/*.scss', gulp.series(styles));
  gulp.watch('src/js/common.js', gulp.series(scripts));
  gulp.watch('src/images/svg/**/*.svg', gulp.series(svg));
};

const svg = gulp.series(svgClean, gulp.parallel(svgSprite));
const dev = gulp.series(gulp.parallel(nunjucks, styles, scripts, svg, watch, serve));

exports.nunjucks = nunjucks;
exports.styles = styles;
exports.scripts = scripts;
exports.svgClean = svgClean;
exports.svgSprite = svgSprite;
exports.watch = watch;
exports.serve = serve;
exports.default = dev;
