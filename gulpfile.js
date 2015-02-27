var gulp = require('gulp'),

	// SCSS
	sass = require('gulp-sass'),
	prefix = require('gulp-autoprefixer'),
	watch = require('gulp-watch'),
	livereload = require('gulp-livereload'),

	// Javascript
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	jsLint = require('gulp-jslint'),

	// Helpers
	sourcemaps = require('gulp-sourcemaps'),
	using = require('gulp-using');



gulp.task('watch',function(){


	livereload.listen(); // <-- Starts livereload

	// I'm watching all the files in the directory, not just the global.scss which becomes my global.css
	//gulp.watch(['scss/***/**/*.scss','docs/index.html'],['sass']);
	gulp.watch([
		'webcourse/scss/**/*.scss',
		'docs/*.html',
		'docs/*.css',
		'src/*.js'
	],['sass','js']); // <-- then it runs the task 'sass' which will compile my scss to css

});

gulp.task('sass', function(){

	return gulp.src('webcourse/scss/main/*.scss')
		.pipe(using())
		.pipe(sass({

			// this lets my scss @import commands work properly
			includePaths:[
				'webcourse/scss/main/partials/*.scss',
				'webcourse/scss/main/vendor/*.scss',
				'webcourse/scss/modules/*.scss'
			]

		})) // <-- this function compiles the scss to css
		// saves time
		.pipe(prefix('last 2 versions',{map:false})) // <-- Cross-Browser prefixing
		.pipe(gulp.dest('webcourse/css')) // <-- it saves in this directory, relative to this file's location
		.pipe(livereload()); // <-- Refresh my browser
});

gulp.task('js',function(){

	return gulp.src([

			// VENDOR
			'src/modernizer.js',
			'src/jquery-1.11.1.js',
			'src/gsap.min.js',
			'src/tinycolor.js',

			// JIVEMAX CORE
			'src/services.js',
			'src/controllers.js',
			'src/factory.js',
			'src/jig.js',
			'src/present.js',
			'src/test.js'
		]) // <-- by listing the source files in order the concat function below will combine them in this order

		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js')) // <-- combine scripts
		.pipe(uglify()) // <-- minify
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('webcourse/js')) // <-- it saves in this directory, relative to this file's location

})

//gulp.task('default',['js','watch']) // DO IT
gulp.task('default',['watch']);