'use strict';

const fs = require("fs");
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const $ = require('gulp-load-plugins')();

// Разметка
gulp.task('pug', () => {
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
    .pipe(browserSync.stream())
});

// Обработка стилей
gulp.task('styles', () => {
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
});

// Обработка скриптов
gulp.task('scripts', () => {
  return gulp.src([
    // Подключаем JS библиотеки
    '!node_modules/jquery/dist/jquery.min.js',
    '!node_modules/picturefill/dist/picturefill.min.js',
    '!node_modules/object-fit-images/dist/ofi.min.js',
    '!node_modules/stickybits/dist/stickybits.min.js',
    '!node_modules/smoothscroll-polyfill/dist/smoothscroll.min.js',
    'node_modules/svgxuse/svgxuse.min.js',
    '!node_modules/pixel-glass/script.js',
    'app/js/common.js', // Всегда в конце
  ])
    // .pipe($.terser())
    .pipe($.concat('main.min.js'))
    .pipe(gulp.dest('app/js/'))
    .pipe(browserSync.stream())
});

// Очистка папки c svg-спрайтом
gulp.task('svgClean', () => {
  return gulp.src('app/images/svg-sprite/**/', {read: false})
    .pipe($.clean());
});

// Обработка SVG, создание svg-спрайта
gulp.task('svgSprite', () => {
  return gulp.src('app/images/svg/**/*.svg')
    .pipe($.svgo({
      plugins: [
        // {
        //   removeAttrs: {
        //     attrs: '*:(stroke|fill):((?!^none$).)*'
        //   }
        // },
        {
          removeUselessStrokeAndFill: false
        },
        { cleanupIDs: false },
        { removeViewBox: false },
        { convertPathData: false },
        { mergePaths: false }
      ]
    }))
    .pipe($.svgstore({ inlineSvg: true }))
    .pipe($.rename('sprite.svg'))
    .pipe(gulp.dest('app/images/svg-sprite/'));
});

// Слежение за изменениями файлов
gulp.task('watch', () => {
  gulp.watch('app/pug/**/*.pug', gulp.series('pug'));
  gulp.watch('app/sass/**/*.scss', gulp.series('styles'));
  gulp.watch('app/js/common.js', gulp.series('scripts'));
  gulp.watch('app/images/svg/**/*.svg', gulp.series('svg'));
});

// Автоперезагрузка браузера (Live Server)
gulp.task('serve', () => {
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
});

gulp.task('svg', gulp.series('svgClean', gulp.parallel('svgSprite')));

gulp.task('default', gulp.series(gulp.parallel('styles', 'scripts', 'svg', 'serve', 'watch')));
