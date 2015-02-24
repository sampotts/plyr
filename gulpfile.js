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
	minifyCss 	= require("gulp-minify-css"),
	runSequence = require("run-sequence"),
	prefix 		= require("gulp-autoprefixer"),
	svgstore 	= require("gulp-svgstore"),
	svgmin 		= require("gulp-svgmin"),
	hogan 		= require("gulp-hogan-compile");

var root = __dirname,
	paths = {
    // Watch paths
    watch: {
    	less: 		path.join(root, "src/less/**/*"),
	    js: 		path.join(root, "src/js/**/*"),
	    sprite: 	path.join(root, "src/sprite/*.svg"),
	    templates: 	path.join(root, "src/templates/*.html"),
    },    
    // Output paths
    output: {
		js:  		path.join(root, "dist/js/"),
		css:  		path.join(root, "dist/css/"),
		sprite:  	path.join(root, "dist/")
    }
},

// Task names
taskNames = {    
	jsAll: 		"js-all",
    lessBuild: 	"less-",
    jsBuild: 	"js-",
    sprite: 	"sprite-build",
    templates: 	"templates"
},
// Task arrays
lessBuildTasks 	= [],
jsBuildTasks 	= [],

// Fetch bundles from JSON
bundles = loadJSON(path.join(root, "bundles.json"));

// Load json
function loadJSON(path) {
    return JSON.parse(fs.readFileSync(path));
}

// Build templates
gulp.task(taskNames.templates, function () {
    return gulp
    	.src(paths.watch.templates)
        .pipe(hogan("templates.js", {
            wrapper: false,
            templateName: function (file) {
                return path.basename(file.relative.replace(/\\/g, "-"), path.extname(file.relative));
            }
        }))
        .pipe(gulp.dest(paths.output.js));
});

// Process JS 
for (var key in bundles.js) {
	(function(key) {
	    var taskName = taskNames.jsBuild + key;
	    jsBuildTasks.push(taskName);

	    gulp.task(taskName, function () {
	        return gulp
	        	.src(bundles.js[key])
				.pipe(concat(key))
	            .pipe(uglify())
	            .pipe(gulp.dest(paths.output.js));
	    });
	})(key);
}

// Process CSS
for (var key in bundles.less) {
    (function (key) {		
	    var taskName = taskNames.lessBuild + key;
	    lessBuildTasks.push(taskName);

	    gulp.task(taskName, function () {
			return gulp
				.src(bundles.less[key])
				.pipe(less())
				.on("error", gutil.log)
				.pipe(concat(key))
				.pipe(prefix(["last 2 versions"], { cascade: true }))
				.pipe(minifyCss())
				.pipe(gulp.dest(paths.output.css));
		});
	})(key);
}

// Process Icons
gulp.task(taskNames.sprite, function () {
	return gulp
		.src(paths.watch.sprite)
		.pipe(svgmin({
			plugins: [{
				removeDesc: true
			}]
		}))
        .pipe(svgstore())
	    .pipe(gulp.dest(paths.output.sprite));
});

// Default gulp task
gulp.task("default", function(){
	runSequence(taskNames.jsAll, lessBuildTasks.concat(taskNames.sprite, "watch"));
});

// Build all JS (inc. templates)
gulp.task(taskNames.jsAll, function(){
	runSequence(taskNames.templates, jsBuildTasks);
});

// Watch for file changes
gulp.task("watch", function () {
	//gulp.watch(paths.watch.templates, [taskNames.jsAll]);
    //gulp.watch(paths.watch.js, [taskNames.jsAll]);
    gulp.watch(paths.watch.less, lessBuildTasks);
    gulp.watch(paths.watch.sprite, [taskNames.iconBuild]);
});