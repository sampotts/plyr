// ==========================================================================
// Gulp build script
// ==========================================================================

const gulp = require('gulp');
const HubRegistry = require('gulp-hub');

gulp.registry(new HubRegistry(['tasks/*.js']));
