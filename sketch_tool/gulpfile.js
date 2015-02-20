var gulp = require('gulp'),
    gulpSequence = require('gulp-sequence'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    karma = require('karma').server,
    browserSync = require('browser-sync');

gulp.task('default', gulpSequence(
    'clean',
    'styles',
    ['serve', 'tdd', 'watch']
));

gulp.task('clean', function(done) {  // 'done' callback forces del to complete before task exits
    del(['css/**'], done);
});

gulp.task('styles', function() {
    gulp.src('styles/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({errLogToConsole: true}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('css'));
});

gulp.task('serve', function() {
    browserSync({
        files: ['index.html', 'css/*.css', 'lib/**/*.js'],  // files to be watched for changes
        open: false,
        server: {
            baseDir: '.'
        }
    });
});

gulp.task('tdd', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

gulp.task('test', function(done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

gulp.task('watch', function() {
    gulp.watch('styles/**/*.scss', ['styles']);
});
