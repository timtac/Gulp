const onError = function(err) {
    console.log(err);
};

const gulp = require('gulp'),
    uglify = require('gulp-uglify')
    ,rename = require('gulp-rename'),
    source_maps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    plumber = require('gulp-plumber'),
    ngAnnotate = require('gulp-ng-annotate'),
    clean = require('gulp-clean'),
    newer = require('gulp-newer'),
    concat = require('gulp-concat');

    gulp.task('annotate', function(){
        return gulp.src(['src/index.controller.js', 'rc/core/**/*.js', 'src/apps/**/*.js',
    '!src/core/lib/**/*', '!src/**/*.min.js'], { base: 'src/./' })
        .pipe(plumber({
            errorHandler:onError
        }))
        .pipe(ngAnnonate())
        .pipe(gulp.dest('src/./'));
    });

    gulp.task('clean-dist', function() {
        return  gulp.src('dist', { read: false })
    .pipe(plumber({
            errorHandler: onError
        }))
            .pipe(clean());
    });

    gulp.task('copy', function(){
        return gulp.src('src/**/*')
    .pipe(plumber({
            errorHandler: onError
        }))
            .pipe(newer('dist'))
    .pipe(gulp.dest('dist'));
    });

    gulp.task('coreservice', function(){
        return gulp.src('src/core/common/**/*')
    .pipe(plumber({
            errorHandler: onError
        }))
            .pipe(concat('core.services.js'))
    .pipe(gulp.dest('./dist/'));
    });

    gulp.task('libs', function() {
        return gulp.src(['bower_components/**//bootstrap/dist/js/bootstrap.min.js' ,
    'bower_components/**//bootstrap/dist/js/bootstrap.min.js',
    'bower_components/**//normalize.css/normalize.css',
    'bower_components/**//fontawesome/css/font-awesome.min.css',
    'bower_components/**//fontawesome/fonts/*.*'])
				.pipe(plumber( {
					errorHandler: onError
				} ))
				.pipe(concat('lib.js'))
				.pipe(gulp.dest('dist/core/lib/bower/./'));
	});

	gulp.task('uglifyalljs', function() {
		return gulp.src(['dist/**/*.js', '!/**/*.min.js', '!dist/core/lib/**/*', '!dist/core/common/**/*'], { base: 'dist/./' })
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(source_maps.init())
        .pipe(newer('dist/ ./'))
                .pipe(uglify())
                .pipe(rename({
                    extname: '.min.js'
        }))
        .pipe(source_maps.write('./'))
                .pipe(gulp.dest('dist/ ./'));
        });

    gulp.task('default', function() {
        runSequence('annotate', 'clean-dist', 'copy', ['coreservices', 'routeconfig', 'libs'], ['uglifyalljs']);
    });