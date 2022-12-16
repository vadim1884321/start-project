const fs = require('fs');
const rimraf = require('rimraf');
const { src, dest, series, parallel, watch } = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const posthtml = require('gulp-posthtml');
// const htmlBeautify = require('gulp-html-beautify');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const esbuild = require('gulp-esbuild');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const svgmin = require('gulp-svgmin');
const svgstore = require('gulp-svgstore');
const browserSync = require('browser-sync');

const isProduction = process.env.NODE_ENV == 'production';

// Разметка
const nunjucks = () => {
  return (
    src('src/_includes/pages/**/*.{html,njk}')
      .pipe(
        plumber({
          errorHandler: function (err) {
            console.log(err.message);
            this.emit('end');
          },
        })
      )
      .pipe(
        nunjucksRender({
          path: ['src/_includes/'],
          envOptions: {
            trimBlocks: true,
            lstripBlocks: true,
          },
          data: {
            nav: JSON.parse(fs.readFileSync('src/_data/navigation.json', 'utf8')),
            site: JSON.parse(fs.readFileSync('src/_data/site.json', 'utf8')),
            year: new Date().getFullYear(),
          },
        })
      )
      // .pipe(htmlBeautify())
      .pipe(posthtml())
      .pipe(replace(/\.\.\//g, './'))
      .pipe(dest('./src/'))
      .pipe(browserSync.stream())
  );
};

// Обработка стилей
const styles = () => {
  return src('src/scss/**/*.scss', { sourcemaps: !isProduction })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err.message);
          this.emit('end');
        },
      })
    )
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(postcss())
    .pipe(replace(/(\.\.\/|\.\/){1,}/g, '../'))
    .pipe(dest('./src/css/', { sourcemaps: !isProduction }))
    .pipe(browserSync.stream());
};

// Обработка скриптов
const scripts = () => {
  return src('./src/js/main.js', { sourcemaps: !isProduction })
    .pipe(
      plumber({
        errorHandler: function (err) {
          console.log(err.message);
          this.emit('end');
        },
      })
    )
    .pipe(
      esbuild({
        target: 'es6',
        outfile: 'main.bundle.js',
        bundle: true,
        minify: isProduction,
        sourcemap: !isProduction,
        // external: ['jquery'],
      })
    )
    .pipe(dest('./src/js/', { sourcemaps: !isProduction }))
    .pipe(browserSync.stream());
};

// Очистка папки c svg-спрайтом
const svgClean = (cb) => {
  return rimraf('./src/images/svg-sprite/**/*', cb);
};

// Обработка SVG, создание svg-спрайта
const svgSprite = () => {
  return src('./src/images/svg-icons/**/*.svg')
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(dest('./src/images/svg-sprite/'));
};

const svg = series(svgClean, parallel(svgSprite));

// Автоперезагрузка браузера (Live Server)
const serve = () => {
  browserSync.init({
    server: {
      baseDir: './src',
    },
    ui: false,
    notify: false,
    open: true,
    // tunnel: true,
    // tunnel: 'projectname', //Demonstration page: http://projectname.localtunnel.me
  });
  // browserSync.watch('./src/*.html', browserSync.reload);
};

const watcher = () => {
  watch('./src/_includes/**/*.{html,njk}', series(nunjucks));
  watch('./src/scss/**/*.scss', series(styles));
  watch('./src/js/**/!(main.bundle.js)*.js', series(scripts));
  watch('./src/images/svg-icons/**/*.svg', series(svg));
};

exports.svg = svg;
exports.nunjucks = nunjucks;
exports.styles = styles;
exports.scripts = scripts;
exports.serve = serve;
exports.watcher = watcher;

exports.build = series(parallel(nunjucks, styles, scripts, svg));
exports.default = series(parallel(nunjucks, styles, scripts, svg), parallel(watcher, serve));
