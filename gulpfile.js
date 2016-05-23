// ==========================================================================
// Gulp build script
// ==========================================================================
/*global require, __dirname,Buffer*/
/*jshint -W079 */

var fs          = require("fs"),
    path        = require("path"),
    gulp        = require("gulp"),
    gutil       = require("gulp-util"),
    concat      = require("gulp-concat"),
    uglify      = require("gulp-uglify"),
    less        = require("gulp-less"),
    sass        = require("gulp-sass"),
    cleanCSS    = require("gulp-clean-css"),
    run         = require("run-sequence"),
    prefix      = require("gulp-autoprefixer"),
    svgstore    = require("gulp-svgstore"),
    svgmin      = require("gulp-svgmin"),
    rename      = require("gulp-rename"),
    s3          = require("gulp-s3"),
    replace     = require("gulp-replace"),
    open        = require("gulp-open"),
    size        = require("gulp-size"),
    through     = require("through2");

var root = __dirname,
paths = {
    plyr: {
        // Source paths
        src: {
            less:       path.join(root, "src/less/**/*"),
            scss:       path.join(root, "src/scss/**/*"),
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
            js:         path.join(root, "docs/src/js/**/*"),
            sprite:     path.join(root, "docs/src/sprite/**/*")
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
    scss:   [],
    js:     [],
    sprite: []
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

// Create a file from a string
// http://stackoverflow.com/questions/23230569/how-do-you-create-a-file-from-a-string-in-gulp
function createFile(filename, string) {
    var src = require('stream').Readable({ 
        objectMode: true 
    });
    src._read = function () {
        this.push(new gutil.File({ 
            cwd: "", 
            base: "", 
            path: filename, 
            contents: new Buffer(string),
            // stats also required for some functions
            // https://nodejs.org/api/fs.html#fs_class_fs_stats
            stat: {
                size: string.length
            } 
        }));
        this.push(null);
    }
    return src
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
                        .pipe(cleanCSS())
                        .pipe(gulp.dest(paths[bundle].output));
                });
            })(key);
        }
    },
    scss: function(files, bundle) {
        for (var key in files) {
            (function (key) {
                var name = "scss-" + key;
                tasks.scss.push(name);

                gulp.task(name, function () {
                    return gulp
                        .src(bundles[bundle].scss[key])
                        .pipe(sass())
                        .on("error", gutil.log)
                        .pipe(concat(key))
                        .pipe(prefix(["last 2 versions"], { cascade: true }))
                        .pipe(cleanCSS())
                        .pipe(gulp.dest(paths[bundle].output));
                });
            })(key);
        }
    },
    sprite: function(bundle) {
        var name = "sprite-" + bundle;
        tasks.sprite.push(name);

        // Process Icons
        gulp.task(name, function () {
            return gulp
                .src(paths[bundle].src.sprite)
                .pipe(svgmin({
                    plugins: [{
                        removeDesc: true
                    }]
                }))
                .pipe(svgstore())
                .pipe(rename({ basename: bundle }))
                .pipe(gulp.dest(paths[bundle].output));
        });
    }
};

// Plyr core files
build.js(bundles.plyr.js, "plyr");
build.less(bundles.plyr.less, "plyr");
build.scss(bundles.plyr.scss, "plyr");
build.sprite("plyr");

// Docs files
build.less(bundles.docs.less, "docs");
build.js(bundles.docs.js, "docs");
build.sprite("docs");

// Build all JS
gulp.task("js", function(){
    run(tasks.js);
});

// Build SCSS (for testing, default is LESS)
gulp.task("scss", function(){
    run(tasks.scss);
});

// Watch for file changes
gulp.task("watch", function () {
    // Plyr core
    gulp.watch(paths.plyr.src.js, tasks.js);
    gulp.watch(paths.plyr.src.less, tasks.less);
    gulp.watch(paths.plyr.src.sprite, tasks.sprite);

    // Docs
    gulp.watch(paths.docs.src.js, tasks.js);
    gulp.watch(paths.docs.src.less, tasks.less);
    gulp.watch(paths.docs.src.sprite, tasks.sprite);
});

// Default gulp task
gulp.task("default", function(){
    run(tasks.js, tasks.less, tasks.sprite, "watch");
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
        }
    },
    docs: {
        headers: {
            "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0",
            "Vary": "Accept-Encoding"
        }
    },
    symlinks: function(version, filename) {
        return {
            headers: {
                // http://stackoverflow.com/questions/2272835/amazon-s3-object-redirect
                "x-amz-website-redirect-location": "/" + version + "/" + filename,
                "Cache-Control": "no-cache, no-store, must-revalidate, max-age=0"
            }
        }
    }
};

// If aws is setup
if("cdn" in aws) {
    var regex       = "(?:0|[1-9][0-9]*)\\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)(?:-[\\da-z\\-]+(?:\.[\\da-z\\-]+)*)?(?:\\+[\\da-z\\-]+(?:\.[\\da-z\\-]+)*)?",
    cdnpath         = new RegExp(aws.cdn.bucket + "\/" + regex, "gi"),
    semver          = new RegExp("v" + regex, "gi"),
    localPath       = new RegExp("(\.\.\/)?dist", "gi"),
    versionPath     = "https://" + aws.cdn.bucket + "/" + version;
}

// Publish version to CDN bucket
gulp.task("cdn", function () {
    console.log("Uploading " + version + " to " + aws.cdn.bucket + "...");

    // Upload to CDN
    return gulp.src(paths.upload)
        .pipe(size({
            showFiles: true,
            gzip: true
        }))
        .pipe(rename(function (path) {
            path.dirname = path.dirname.replace(".", version);
        }))
        .pipe(replace(localPath, versionPath))
        .pipe(s3(aws.cdn, options.cdn));
});

// Publish to Docs bucket
gulp.task("docs", function () {
    console.log("Uploading " + version + " docs to " + aws.docs.bucket + "...");

    // Replace versioned files in readme.md
    gulp.src([root + "/readme.md"])
        .pipe(replace(cdnpath, aws.cdn.bucket + "/" + version))
        .pipe(gulp.dest(root));

    // Replace versioned files in plyr.js
    gulp.src(path.join(root, "src/js/plyr.js"))
        .pipe(replace(semver, "v" + version))
        .pipe(replace(cdnpath, aws.cdn.bucket + "/" + version))
        .pipe(gulp.dest(path.join(root, "src/js/")));

    // Replace local file paths with remote paths in docs HTML
    // e.g. "../dist/plyr.js" to "https://cdn.plyr.io/x.x.x/plyr.js"
    gulp.src([paths.docs.root + "*.html"])
        .pipe(replace(localPath, versionPath))
        .pipe(s3(aws.docs, options.docs));

    // Upload error.html to cdn (as well as docs site)
    return gulp.src([paths.docs.root + "error.html"])
        .pipe(replace(localPath, versionPath))
        .pipe(s3(aws.cdn, options.docs));
});

// Open the docs site to check it's sweet
gulp.task("symlinks", function () {
    console.log("Updating symlinks...");

    return gulp.src(paths.upload)
        .pipe(through.obj(function (chunk, enc, callback) {
            if (chunk.stat.isFile()) {
                // Get the filename
                var filename = chunk.path.split("/").reverse()[0];

                // Create the 0 byte redirect files to upload
                createFile(filename, "")
                    .pipe(rename(function (path) {
                        path.dirname = path.dirname.replace(".", "latest");
                    }))
                    // Upload to S3 with correct headers
                    .pipe(s3(aws.cdn, options.symlinks(version, filename)));
            }

            callback(null, chunk);
        }));
});

// Open the docs site to check it's sweet
gulp.task("open", function () {
    console.log("Opening " + aws.docs.bucket + "...");

    // A file must be specified or gulp will skip the task
    // Doesn't matter which file since we set the URL above
    // Weird, I know...
    return gulp.src([paths.docs.root + "index.html"])
        .pipe(open("", {
            url: "http://" + aws.docs.bucket
        }));
});

// Do everything
gulp.task("publish", function () {
    run(tasks.js, tasks.less, tasks.sprite, "cdn", "docs", "symlinks");
});
