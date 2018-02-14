'use strict';

/**
 * Gulp tasks available:
 * $ gulp => run the build for production
 * $ gulp dev => run the watch over scss and js files and avoid minification.
 * Browsersync is available on localhost:7000
 * $ gulp dev-no-watch => avoid the watch and the minification
 */

// General plugins
const
    gulp = require('gulp'),
    path = require('./sources/config/gulpconfig'),
    del = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    browserSync = require('browser-sync'),
    env = require ('gulp-env');

// SASS related plugins
const
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer');

// JAVASCRIPT related plugins
const
    mocha = require('gulp-mocha'),
    babel = require('gulp-babel'),
    bundle = require('gulp-bundle-assets');

// Imagemin Plugins
const
    imagemin = require('gulp-imagemin'),
    newer = require('gulp-newer'),
    destClean = require('gulp-dest-clean');

/**
 * Clean directories
 */
gulp.task('css:clean', function () {
    return del([
        path.dest + path.css.dest
    ]);
});

gulp.task('js:clean', function () {
    return del([
        path.dest + path.js.dest
    ]);
});

gulp.task('fonts:clean', () => {
    return del([
        path.dest + path.fonts.dest
    ])
});

gulp.task('images:clean', () => {
    return del([
        path.dest + path.images.dest
    ])
});

/**
 * IMAGE MIN
 */
gulp.task('images', ['images:newer'], function() {
    return gulp.src(path.src + path.images.src, {read:false})
    //The gulp plugin gulp-dest-clean allows you to remove files from the
    // destination folder which do not exist in the stream and do not match
    // optionally supplied patterns.
        .pipe(destClean(path.dest + path.images.dest))
        .pipe(gulp.dest(path.dest + path.images.dest))
});

gulp.task('images:newer', function() {
    return gulp.src(path.src + path.images.src)
        .pipe(newer(path.dest + path.images.dest))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 10}),
        ]))
        .pipe(gulp.dest(path.dest + path.images.dest));
});

gulp.task('images:rebuild', ['images:clean'], function() {
    return gulp.src(path.src + path.images.src)
        .pipe(newer(path.dest + path.images.dest))
        .pipe(imagemin([
            imagemin.gifsicle({interlaced: true}),
            imagemin.jpegtran({progressive: true}),
            imagemin.optipng({optimizationLevel: 10}),
        ]))
        .pipe(gulp.dest(path.dest + path.images.dest));
});

/**
 * SASS
 */
gulp.task('sass', ['css:clean'], function () {
    return gulp.src(path.src + path.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.dest + path.css.dest))
        .pipe(browserSync.stream())
});

gulp.task('sass:dev', function () {
    return gulp.src(path.src + path.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.dest + path.css.dest))
        .pipe(browserSync.stream())
});

gulp.task('sass:devWithClean', ['css:clean'], function () {
    return gulp.src(path.src + path.scss.src)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.dest + path.css.dest))
        .pipe(browserSync.stream())
});

gulp.task('js', ['bundle'], function () {
    return del([
        path.dest + path.js.temp
    ]);
});

gulp.task('js:dev', ['bundle:dev'], function () {
    return del([
        path.dest + path.js.temp
    ]);
});

gulp.task('bundle', ['jsCompile'], function() {

    // Set the environment for uglify the files
    env({
        vars: {
            'NODE_ENV': 'production'
        }
    });

    return gulp.src('./sources/config/bundle.js')
        .pipe(bundle())
        .pipe(bundle.results({
            dest: './public/js/',
            pathPrefix: '/js/',
            uglify: false
        }))
        .pipe(gulp.dest(path.dest + path.js.dest));
});

gulp.task('bundle:dev', ['jsCompile'], function() {

    // Set the environment for avoid uglification
    env({
        vars: {
            'NODE_ENV': 'develop'
        }
    });

    return gulp.src('./sources/config/bundle.js')
        .pipe(bundle())
        .pipe(bundle.results({
            dest: './public/js/',
            pathPrefix: '/js/'
        }))
        .pipe(gulp.dest(path.dest + path.js.dest));
});

gulp.task('jsCompile', ['js:clean'], () => {
    return gulp.src([path.src + path.js.src])
        .pipe(babel({
            presets: ['env'],
            // ignore: ['sources/js/vendors/lazyload.js']
        }))
        .pipe(gulp.dest(path.dest + path.js.temp));
});

/**
 * TESTS (they're called as a 1st, but run as last)
 */
gulp.task('js:tests', ['js'], () =>
    gulp.src('test.js', {read: false})
    // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}))
);

gulp.task('js:tests:dev', ['js:dev'], () =>
    gulp.src('test.js', {read: false})
    // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}))
);

/**
 * Symlink task
 */
gulp.task('copyFonts', ['fonts:clean'], () => {
    return gulp.src(path.src + path.fonts.src)
        .pipe(gulp.dest(path.dest + path.fonts.dest));
});

/**
 * Watches
 */
function watches(){
    gulp.watch(path.src + path.scss.src, ['sass:dev']);
    gulp.watch(path.src + path.js.src, ['js:tests:dev']);
    gulp.watch(['./views/**/*.hbs', './routes/**/*.js', './app.js'])
        .on('change', browserSync.reload);
}

/**
 * TASKS LIST
 */
gulp.task('default', ['copyFonts', 'sass', 'js:tests']);
gulp.task('dev', ['copyFonts', 'sass:devWithClean', 'js:tests:dev'], () => {
    browserSync.init(null, {
        proxy: "http://localhost:3000",
        // files: ["public/**/*.*"],
        browser: "google chrome",
        port: 7000,
    });
    watches();
});
gulp.task('dev-no-server',
    ['copyFonts', 'sass:devWithClean', 'js:tests:dev'], () => {
        watches();
    });
gulp.task('dev-no-watch',
    ['copyFonts', 'sass:devWithClean', 'js:tests:dev']);