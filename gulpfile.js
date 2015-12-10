// ==========================================================================
// Gulp build script
// ==========================================================================
/*global require, __dirname*/
/*jshint -W079 */

var fs          = require("fs"),
    path        = require("path"),
    gulp        = require("gulp"),
    gutil       = require("gulp-util"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    less        = require("gulp-less"),
    sass        = require("gulp-sass"),
    minify      = require("gulp-minify-css"),
    run         = require("run-sequence"),
    prefix      = require("gulp-autoprefixer"),
    svgstore    = require("gulp-svgstore"),
    svgmin      = require("gulp-svgmin"),
    rename      = require("gulp-rename"),
    s3          = require("gulp-s3"),
    gzip        = require("gulp-gzip"),
    replace     = require("gulp-replace"),
    open        = require("gulp-open"),
    size        = require("gulp-size");

var root = __dirname,
paths = {
    plyr: {
        // Source paths
        src: {
            less:       path.join(root, "src/less/**/*"),
            sass:       path.join(root, "src/sass/**/*"),
            js:         path.join(root, "src/js/**/*"),
            sprite:     path.join(root, "src/sprite/*.svg")
        },
        // Output paths
        output:         path.join(root, "dist/")
    },
    docs: {
        // Source paths
        src: {
            less:       path.join(root, "docs/src/less/**/*"),
            js:         path.join(root, "docs/src/js/**/*")
        },
        // Output paths
        output:         path.join(root, "docs/dist/"),
        // Docs
        root:           path.join(root, "docs/")
    },
    upload: [path.join(root, "dist/**"), path.join(root, "docs/dist/**")]
},

// Task arrays
tasks = {
    less:   [],
    sass:   [],
    js:     []
},

// Fetch bundles from JSON
bundles = loadJSON(path.join(root, "bundles.json")),
package = loadJSON(path.join(root, "package.json"));

// Load json
function loadJSON(path) {
    try {
        return JSON.parse(fs.readFileSync(path));
    }
    catch(err) {
        return {};
    }
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
    }
};

// Plyr core files
build.js(bundles.plyr.js, "plyr");
build.less(bundles.plyr.less, "plyr");
build.sass(bundles.plyr.sass, "plyr");
build.sprite();

// Docs files
build.less(bundles.docs.less, "docs");
build.js(bundles.docs.js, "docs");

// Build all JS
gulp.task("js", function(){
    run(tasks.js);
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
    gulp.watch(paths.plyr.src.sprite, ["sprite"]);

    // Docs
    gulp.watch(paths.docs.src.js, tasks.js);
    gulp.watch(paths.docs.src.less, tasks.less);
});

// Default gulp task
gulp.task("default", function(){
    run(tasks.js, tasks.less, "sprite", "watch");
});

// Publish a version to CDN and docs
// --------------------------------------------

// Some options
var aws = loadJSON(path.join(root, "aws.json")),
version = package.version,
maxAge  = 31536000, // seconds 1 year
options = {
    cdn: {
        headers: {
            "Cache-Control": "max-age=" + maxAge,
            "Vary": "Accept-Encoding"
        },
        gzippedOnly: true
    },
    docs: {
        headers: {
            "Cache-Control": "public, must-revalidate, proxy-revalidate, max-age=0",
            "Vary": "Accept-Encoding"
        },
        gzippedOnly: true
    }
};

// If aws is setup
if("cdn" in aws) {
    var cdnpath = new RegExp(aws.cdn.bucket + "\/(\\d+\\.)?(\\d+\\.)?(\\*|\\d+)","gi");
}

// Publish version to CDN bucket
gulp.task("cdn", function () {
    console.log("Uploading " + version + " to " + aws.cdn.bucket);

    // Upload to CDN
    gulp.src(paths.upload)
        .pipe(size({
            showFiles: true,
            gzip: true
        }))
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(".", version);
        }))
        .pipe(gzip())
        .pipe(s3(aws.cdn, options.cdn));
});

// Publish to Docs bucket
gulp.task("docs", function () {
    console.log("Uploading " + version + " docs to " + aws.docs.bucket);

    // Replace versioned files in readme.md
    gulp.src([root + "/readme.md"])
        .pipe(replace(cdnpath, aws.cdn.bucket + "/" + version))
        .pipe(gulp.dest(root));

    // Replace versioned files in *.html
    gulp.src([paths.docs.root + "*.html"])
        .pipe(replace(cdnpath, aws.cdn.bucket + "/" + version))
        .pipe(gulp.dest(paths.docs.root))
        .pipe(gzip())
        .pipe(s3(aws.docs, options.docs));

    // Upload error.html to cdn using docs options
    gulp.src([paths.docs.root + "error.html"])
        .pipe(gzip())
        .pipe(s3(aws.cdn, options.docs));
});

// Open the docs site to check it's sweet
gulp.task("open", function () {
    console.log("Opening " + aws.docs.bucket + "...");

    // A file must be specified or gulp will skip the task
    // Doesn't matter which file since we set the URL above
    // Weird, I know...
    gulp.src([paths.docs.root + "index.html"])
        .pipe(open("", {
            url: "http://" + aws.docs.bucket
        }));
});

// Do everything
gulp.task("publish", function () {
    run(tasks.js, tasks.less, "sprite", "cdn", "docs");
});
