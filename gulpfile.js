// example of a common gulpfile
const config=require('./config/config.json');
const gulp = require('gulp');
const gutil = require('gulp-util');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

gulp.task('button', () =>
  gulp.src('src/donate-button.v2.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
	presets: ['env']
    }))
     .pipe(replace('REPLACE_FULL_HOST', config.button.url))
     .pipe(replace('REPLACE_CSS_URL', config.button.css))
    .pipe(uglify())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
    .pipe(sourcemaps.write('maps'))
  .pipe(gulp.dest('public/js'))
);

gulp.task('default', ['button']);
