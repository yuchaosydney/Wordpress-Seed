var
  gulp           = require('gulp'),
  plumber        = require('gulp-plumber'),
  prefixer       = require('gulp-autoprefixer'),
  coffee         = require('gulp-coffee'),
  sass           = require('gulp-sass'),
  gutil          = require('gulp-util'),
  minify         = require('gulp-minify-css'),
  uglify         = require('gulp-uglify'),
  concat         = require('gulp-concat'),
  mainBowerFiles = require('main-bower-files'),
  imagemin       = require('gulp-imagemin'),
  pngquant       = require('imagemin-pngquant'),
  jpegtran       = require('imagemin-jpegtran'),
  notify         = require('gulp-notify');

// WATCH
gulp.task('watch', watch);

// Compile sass files and move them to dist/styles
gulp.task('sass', compileSass);

// Compile coffee files and move them to dist/scripts
gulp.task('coffee', compileCoffee);

gulp.task('js', compileJs);

// Crush images and move them to dist/images
gulp.task('crushImages', crushImages);

// Move bower packages to vendor
gulp.task('bower', extractBowerFiles);

gulp.task('build', ['sass', 'coffee', 'js', 'bower', 'crushImages']);

gulp.task('default', ['watch']);

function watch() {
  gulp.watch('dev/styles/**/*.scss', ['sass']);
  gulp.watch('dev/scripts/**/*.coffee', ['coffee']);
  gulp.watch('dev/scripts/**/*.js', ['js']);
  gulp.watch('dev/images/*', ['crushImages']);
  gulp.watch('bower.json', ['bower']);
}

function compileJs() {
  return gulp.src('dev/scripts/**/*.js')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(gulp.dest('scripts'));
}

function compileCoffee() {
  return gulp.src('dev/scripts/**/*.coffee')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(coffee({ bare: true }).on('error', gutil.log))
             .pipe(gulp.dest('scripts'));
}

function compileSass() {
  return gulp.src('dev/styles/main.scss')
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(sass())
             .pipe(minify({keepSpecialComments: '1'}))
             .pipe(prefixer('last 2 version'))
             .pipe(concat('style.css'))
             .pipe(gulp.dest('./'));
}

function extractBowerFiles() {
  return gulp.src(mainBowerFiles())
             .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
             .pipe(gulp.dest('vendor'));
}

function crushImages() {
  return gulp.src('dev/images/*')
              .pipe(imagemin({
                progressive : true,
                use : [
                  pngquant({ quality: '65-80', speed: 4 }),
                  jpegtran({ progressive: true })
                ]
              }))
              .pipe(gulp.dest('images/'));
}

