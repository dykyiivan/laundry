const { src, dest, series, parallel, watch } = require('gulp');
const browserSync         = require('browser-sync').create();
const concat              = require('gulp-concat'); // contatination file
const uglify              = require('gulp-uglify-es').default; // minify js
const sass                = require('gulp-sass');
const autoprefixer        = require('gulp-autoprefixer');
const cleancss            = require('gulp-clean-css');
const imagemin            = require('gulp-imagemin');
const newer               = require('gulp-newer');
const del                 = require('del');


// Create functions
function browsersync(){
  browserSync.init({
    server: {
      baseDir: 'app',
    },
    notify: false,
    online: true, // false - if i want to work without internet
  });
}

function scripts() {
  return src([
    "app/js/jquery.js",
    "node_modules/slick-carousel/slick/slick.min.js",
    "app/js/main.js",
  ])
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js/"))
    .pipe(browserSync.stream());
}


function styles() {
  return src([
    "node_modules/slick-carousel/slick/slick.scss",
    "node_modules/slick-carousel/slick/slick-theme.scss",
    "app/scss/main.scss",
  ])
    .pipe(sass())
    .pipe(concat("main.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserlist: ["last 10 versions"],
        cascade: false,
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: { 1: { specialComments: 0 } /*, format: 'beautify'*/ },
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function images() {
  return src('app/images/src/**/*')
    .pipe(newer('app/images/dest/'))
    .pipe(imagemin())
    .pipe(dest('app/images/dest'))
}

function cleanimg() {
  return del('app/images/dest/**/*', {force: true})
}

function cleandist() {
  return del('dist/**/*', {force: true})
}

function startwatch() {
  watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scripts)
  watch(['app/scss/*.scss'], styles)
  watch('app/**/*.html').on('change', browserSync.reload)
  watch('app/images/src/**/*', images);
}

function build() {
  return src([
    'app/css/**/*.min.css',
    'app/js/**/*.min.js',
    'app/images/dest/**/*',
    'app/**/*.html',
    'app/fonts/**/*'
  ], { base: 'app' })
  .pipe(dest('dist'));
}

// Exports functions in tasks
exports.browsersync = browsersync;
exports.scripts     = scripts;
exports.styles      = styles;
exports.images      = images;
exports.cleanimg    = cleanimg;
exports.build       = series(cleandist, styles, scripts, images, build);


// Defalt task
exports.default = parallel(scripts, styles, browsersync, startwatch);

