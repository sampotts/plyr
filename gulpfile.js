// ==========================================================================
// Gulp build script
// ==========================================================================

import gulp from 'gulp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

// Load all task files from the "tasks" folder
const tasksDir = join(import.meta.dirname, 'tasks');
readdirSync(tasksDir)
  .filter((file) => file.endsWith('.js')) // Only include JavaScript files
  .forEach((file) => {
    import(join(tasksDir, file)); // Dynamically import each task file
    });

  // Import and re-export the default task from the build script
  import buildDefault from './tasks/build.js';
  export default buildDefault;
