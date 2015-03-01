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
	hogan 		= require("gulp-hogan-compile"),
	rename 		= require("gulp-rename"),
	s3 			= require("gulp-s3"),
	gzip 		= require("gulp-gzip");

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
		output: path.join(root, "dist/")
	},
	docs: {
		// Source paths
		src: {
			less: 		path.join(root, "docs/src/less/**/*"),
			js: 		path.join(root, "docs/src/js/**/*"),
			templates: 	path.join(root, "docs/src/templates/*.html")
		},
		// Output paths
		output: path.join(root, "docs/dist/")
	}
},

// Task arrays
tasks = {    
	less: 	[],
	sass: 	[],
	js:   	[]
},

// Fetch bundles from JSON
bundles = loadJSON(path.join(root, "bundles.json")),
package = loadJSON(path.join(root, "package.json"));

// Load json
function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path));
}

var build = {
	js: function (files, bundle) {
		for (var key in files) {
			(function(key) {
				var name = "js-" + key;
				tasks.js.push(name);

				gulp.task(name, function () {
					return gulp
						.src(bundles[bundle].js[key])
						.pipe(concat(key))
						.pipe(uglify())
						.pipe(gulp.dest(paths[bundle].output));
				});
			})(key);
		}
	},
	less: function(files, bundle) {
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
						.pipe(gulp.dest(paths[bundle].output));
				});
			})(key);
		}
	},
	sass: function(files, bundle) {
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
						.pipe(gulp.dest(paths[bundle].output));
				});
			})(key);
		}
	},
	sprite: function() {
		// Process Icons
		gulp.task("sprite", function () {
			return gulp
				.src(paths.plyr.src.sprite)
				.pipe(svgmin({
					plugins: [{
						removeDesc: true
					}]
				}))
		        .pipe(svgstore())
			    .pipe(gulp.dest(paths.plyr.output));
		});
	},
	templates: function() {
		// Build templates
		gulp.task("templates", function () {
			return gulp
				.src(paths.docs.src.templates)
				.pipe(hogan("templates.js", {
					wrapper: false,
					templateName: function (file) {
						return path.basename(file.relative.replace(/\\/g, "-"), path.extname(file.relative));
					}
				}))
				.pipe(gulp.dest(paths.docs.output));
		});
	}
};

// Plyr core files
build.js(bundles.plyr.js, "plyr");
build.less(bundles.plyr.less, "plyr");
build.sass(bundles.plyr.sass, "plyr");
build.sprite();

// Docs files
build.templates();
build.less(bundles.docs.less, "docs");
build.js(bundles.docs.js, "docs");

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

// Publish the docs site
gulp.task("cdn", function () {
	try {
		var aws 	= loadJSON(path.join(root, "aws.json")),
			version = package.version,
			maxAge 	= 31536000, // seconds 1 year
			options = {
				headers: {
					"Cache-Control": "max-age=" + maxAge + ", no-transform, public",
					"Content-Encoding": "gzip",
					"Vary": "Accept-Encoding"
				},
				gzippedOnly: true
			};

		console.log("Publishing " + version);

		return gulp.src("dist/**")
			.pipe(rename(function (path) {
			    path.dirname = path.dirname.replace(".", version);
			}))
			.pipe(gzip())
			.pipe(s3(aws, options));
	} 
	catch (e) {}
});

gulp.task("publish", function () {

});