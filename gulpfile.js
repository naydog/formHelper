var gulp = require("gulp"),
  uglify = require("gulp-uglify"),
  rename = require("gulp-rename");

gulp.task('minifyjs', function() {
  var options = {
    preserveComments: 'license'
  };
  gulp.src(['src/*.js'])
    .pipe(uglify(options))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dest/'));
})

gulp.task("default", function() {
  gulp.start('minifyjs');
});
