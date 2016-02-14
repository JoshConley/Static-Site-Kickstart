'use strict';

// Gulp Plugins
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import cssnano from 'gulp-cssnano';
import define from 'metalsmith-define';
import del from 'del';
import gulp from 'gulp';
import gulpsmith from 'gulpsmith';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import watch from 'gulp-watch';
import webserver from 'gulp-webserver';

// Metalsmith Plugins
import inPlace from 'metalsmith-in-place';
import layouts from 'metalsmith-layouts';

gulp.task('clean', () => {
  return del(['build/**/*']);
});

gulp.task('javascript:es6', () => {
  return gulp.src([
      'src/assets/js/**/*.js',
      '!src/assets/js/plugins/**/*.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/js'));
});

gulp.task('javascript:move', () => {
  return gulp.src('src/assets/js/plugins/**/*.js')
    .pipe(gulp.dest('build/assets/js/plugins'));
});

gulp.task('css', () => {
  return gulp.src('src/assets/css/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(cssnano())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/css'));
});

gulp.task('images', () => {
  return gulp.src('src/assets/images/**/*')
    .pipe(gulp.dest('build/assets/images'));
});

gulp.task('metalsmith:dev', () => {
  return gulp.src('src/**/*.html')
    .pipe(
      gulpsmith()
        .use(define({
          config: {
            environment: 'development'
          }
        }))
        .use(layouts({
          engine: 'swig',
          pattern: '**/*.html',
          partials: 'partials'
        }))
        .use(inPlace({
          engine: 'swig',
          partials: 'partials'
        }))
    )
    .pipe(gulp.dest('build'));
});

gulp.task('webserver', () => {
  return gulp.src('build')
    .pipe(webserver())
});

gulp.task('serve', (cb) => {
  gulp.watch('./src/assets/css/**/*.scss', ['css']);
  gulp.watch('./src/assets/js/**/*.js', ['javascript:es6']);
  gulp.watch([
    './src/**/*.html',
    './partials/**/*.html'
  ], ['metalsmith:dev']);

  return runSequence('clean', ['javascript:es6', 'javascript:move', 'css', 'images'], 'metalsmith:dev', 'webserver', cb);
});
