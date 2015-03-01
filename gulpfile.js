// ==========================================================================
// Gulp build script
// ==========================================================================
/*global require, __dirname*/

var fs 			= require("fs"),
	path 		= require("path"),
	gulp 		= require("gulp"),
	gutil 		= require("gulp-util"),
	concat 		= require("gulp-concat"),
	uglify 		= require("gulp-uglify"),
	less 		= require("gulp-less"),
	sass 		= require("gulp-sass"),
	minify 		= require("gulp-minify-css"),
	run 		= require("run-sequence"),
	prefix 		= require("gulp-autoprefixer"),
	svgstore 	= require("gulp-svgstore"),
	svgmin 		= require("gulp-svgmin"),
	hogan 		= require("gulp-hogan-compile");

var root = __dirname,
	paths = {
	plyr: {
		// Source paths
		src: {
			less: 		path.join(root, "src/less/**/*"),
			sass: 		path.join(root, "src/sass/**/*"),
			js: 		path.join(root, "src/js/**/*"),
			sprite: 	path.join(root, "src/sprite/*.svg")
		},
		// Output paths
		output: {
			js:  		path.join(root, "dist/js/"),
			css:  		path.join(root, "dist/css/"),
			sprite:  	path.join(root, "dist/")
		}
	},
	docs: {
		// Source paths
		src: {
			less: 		path.join(root, "docs/src/less/**/*"),
			js: 		path.join(root, "docs/src/js/**/*"),
			templates: 	path.join(root, "docs/src/templates/*.html")
		},
		// Output paths
		output: {
			js:  		path.join(root, "docs/dist/js/"),
			css:  		path.join(root, "docs/dist/css/")
		}
	}
},

// Task arrays
tasks = {    
	less: 	[],
	sass: 	[],
	js:   	[]
},

// Fetch bundles from JSON
bundles = loadJSON(path.join(root, "bundles.json"));

// Load json
function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path));
}

var build = {
	js: function (files, bundle, output) {
		for (var key in files) {
			(function(key) {
				var name = "js-" + key;
				tasks.js.push(name);

				gulp.task(name, function () {
					return gulp
						.src(bundles[bundle].js[key])
						.pipe(concat(key))
						.pipe(uglify())
						.pipe(gulp.dest(output));
				});
			})(key);
		}
	},
	less: function(files, bundle, output) {
		for (var key in files) {
			(function (key) {		
				var name = "less-" + key;
				tasks.less.push(name);

				gulp.task(name, function () {
					return gulp
						.src(bundles[bundle].less[key])
						.pipe(less())
						.on("error", gutil.log)
						.pipe(concat(key))
						.pipe(prefix(["last 2 versions"], { cascade: true }))
						.pipe(minify())
						.pipe(gulp.dest(output));
				});
			})(key);
		}
	},
	sass: function(files, bundle, output) {
		for (var key in files) {
			(function (key) {		
				var name = "sass-" + key;
				tasks.sass.push(name);

				gulp.task(name, function () {
					return gulp
						.src(bundles[bundle].sass[key])
						.pipe(sass())
						.on("error", gutil.log)
						.pipe(concat(key))
						.pipe(prefix(["last 2 versions"], { cascade: true }))
						.pipe(minify())
						.pipe(gulp.dest(output));
				});
			})(key);
		}
	},
	sprite: function(source, output) {
		// Process Icons
		gulp.task("sprite", function () {
			return gulp
				.src(source)
				.pipe(svgmin({
					plugins: [{
						removeDesc: true
					}]
				}))
		        .pipe(svgstore())
			    .pipe(gulp.dest(output));
		});
	},
	templates: function(source, output) {
		// Build templates
		gulp.task("templates", function () {
			return gulp
				.src(source)
				.pipe(hogan("templates.js", {
					wrapper: false,
					templateName: function (file) {
						return path.basename(file.relative.replace(/\\/g, "-"), path.extname(file.relative));
					}
				}))
				.pipe(gulp.dest(output));
		});
	}
};

// Plyr core files
build.js(bundles.plyr.js, "plyr", paths.plyr.output.js);
build.less(bundles.plyr.less, "plyr", paths.plyr.output.css);
build.sass(bundles.plyr.sass, "plyr", paths.plyr.output.css);
build.sprite(paths.plyr.src.sprite, paths.plyr.output.sprite);

// Docs files
build.templates(paths.docs.src.templates, paths.docs.output.js);
build.less(bundles.docs.less, "docs", paths.docs.output.css);
build.js(bundles.docs.js, "docs", paths.docs.output.js);

// Default gulp task
gulp.task("default", function(){
	run("templates", tasks.js, tasks.less, "sprite");
});

// Build all JS (inc. templates)
gulp.task("js", function(){
	run("templates", tasks.js);
});

// Build SASS (for testing, default is LESS)
gulp.task("sass", function(){
	run(tasks.sass);
});

// Watch for file changes
gulp.task("watch", function () {
	// Plyr core
    gulp.watch(paths.plyr.src.js, tasks.js);
    gulp.watch(paths.plyr.src.less, tasks.less);
    gulp.watch(paths.plyr.src.sprite, "sprite");

    // Docs
    gulp.watch(paths.docs.src.js, tasks.js);
    gulp.watch(paths.docs.src.less, tasks.less);
	gulp.watch(paths.docs.src.templates, "js");
});