var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename"),
  cleancss = require('gulp-clean-css');

gulp.task('minifyjs', function() {
  var options = {
    preserveComments: 'license'
  };
  gulp.src(['src/*.js'])
    .pipe(uglify(options))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dest/'));
});

gulp.task('cleancss', function() {
  gulp.src(['src/*.css'])
    .pipe(cleancss())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dest/'));
});

gulp.task("default", function() {
  gulp.start('minifyjs', 'cleancss');
});
