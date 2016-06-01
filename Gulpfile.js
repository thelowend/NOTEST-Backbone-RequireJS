var gulp = require('gulp'),
 	browserSync = require('browser-sync').create(),
 	sass = require('gulp-sass'),
 	sourcemaps = require('gulp-sourcemaps'),
 	autoprefixer = require('gulp-autoprefixer'),
 	useref = require('gulp-useref'),
 	uglify = require('gulp-uglify'),
 	gulpIf = require('gulp-if'),
 	cssnano = require('gulp-cssnano'),
 	imagemin = require('gulp-imagemin'),
 	cache = require('gulp-cache'),
 	del = require('del'),
 	runSequence = require('run-sequence'),
 	changed = require('gulp-changed'),
 	requirejsOptimize = require('gulp-requirejs-optimize');

var SRC = 'app';
var DEST = 'dist';

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: SRC
    },
  })
});

var autoprefixerOptions = {
  browsers: ['last 2 versions', 'not ie < 9']
};

gulp.task('sass', function () {
  return gulp
    .src(SRC + '/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest(SRC + '/css/'));
});

gulp.task('scripts', function () {
    return gulp.src(SRC + '/js/main.js')
    	.pipe(sourcemaps.init())
        .pipe(requirejsOptimize({
        	paths: {
		        "jquery": "libs/jquery/dist/jquery.min",
		        "underscore": "libs/underscore-amd/underscore-min",
		        "backbone": "libs/backbone-amd/backbone-min"
		    }
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEST + '/js/'));
});

gulp.task('useref', function() {
  return gulp.src(SRC + '/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest(DEST))
});

gulp.task('images', function() {
  return gulp.src(SRC + '/img/**/*.+(png|jpg|jpeg|gif|svg)')
  .pipe(changed(DEST + '/img'))
  .pipe(cache(imagemin()))
  .pipe(gulp.dest(DEST + '/img'))
});

gulp.task('fonts', function() {
  return gulp.src(SRC + '/fonts/**/*')
  .pipe(changed(DEST + '/fonts'))
  .pipe(gulp.dest(DEST + '/fonts'))
});

gulp.task('clean:dist', function() {
  return del.sync(DEST);
});

gulp.task('cache:clear', function (callback) {
return cache.clearAll(callback)
});


// ------ MAIN TASKS ----- //
gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});

gulp.task('watch', ['browserSync', 'sass'], function () {
  gulp.watch(SRC + '/scss/**/*.scss', ['sass']); 
  gulp.watch(SRC + '/*.html', browserSync.reload);
  gulp.watch(SRC + '/css/**/*.css', browserSync.reload);
  gulp.watch(SRC + '/js/**/*.js', browserSync.reload);
});

gulp.task('build', function (callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'scripts', 'images', 'fonts'],
    callback
  )
});