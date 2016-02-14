'use strict';

// Gulp Plugins
import autoprefixer from 'gulp-autoprefixer';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import cssnano from 'gulp-cssnano';
import del from 'del';
import gulp from 'gulp';
import gulpsmith from 'gulpsmith';
import runSequence from 'run-sequence';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';

// Metalsmith Plugins
import inPlace from 'metalsmith-in-place';
import layouts from 'metalsmith-layouts';

gulp.task('clean', () => {
  return del(['build/**/*']);
});

gulp.task('javascript', () => {
  return gulp.src('src/assets/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/assets/js'));
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

gulp.task('serve', (cb) => {
  runSequence('clean', ['javascript', 'css', 'images'], 'metalsmith:dev');
});