var gulp = require('gulp'),
    gutil = require('gulp-util'),
    webpack = require('webpack'),
    plugins = require('gulp-load-plugins')({lazy:false});

gulp.task('scripts', function(callback) {
  webpack({
    entry: {
      'contentscript': './app/scripts/contentscript.js',
      'background': './app/scripts/background.js',
      'popup': './app/scripts/popup.js',
    },
    output: {
      path: './dist/scripts/',
      filename: '[name].js'
    },
    module: {
      loaders: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      }]
    }
  }).run(function(err, stats) {
    if (err) {
      console.log(err);
      throw new gutil.PluginError('webpack', err);
    }
    console.log(stats.toString());
    callback();
  });
  
});
gulp.task('css', function() {
  return gulp.src('./app/styles/main.scss')
    .pipe(plugins.sass())
    .pipe(gulp.dest('./dist/styles/'));
});
gulp.task('copy:images', function() {
  return gulp.src('./app/images/**/*').pipe(gulp.dest('./dist/images/'));
});
gulp.task('copy:html', function() {
  return gulp.src('./app/**/*.html').pipe(gulp.dest('./dist/'));
});
gulp.task('copy:manifest', function() {
  return gulp.src('./app/manifest.json').pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  plugins.watch('./app/**/*.*', plugins.batch(function (events, done) {
    gulp.start('build', done);
  }));
});
gulp.task('copy', ['copy:manifest', 'copy:images', 'copy:html']);
gulp.task('build', ['copy', 'scripts', 'css']);
gulp.task('default', ['build']);




