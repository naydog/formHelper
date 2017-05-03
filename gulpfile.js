var gulp = require("gulp"),
  uglify = require("gulp-uglify");

gulp.task('minifyjs', function() {
  var options = {
    preserveComments: 'license'
  };
  gulp.src(['src/*.js'])
    .pipe(uglify(options))
    .pipe(gulp.dest('dest/'));
})

gulp.task("default", function() {
  gulp.start('minifyjs');
});
