// ==========================================================================
// Gulp build script
// ==========================================================================

// import { join } from 'node:path';

// Import and re-export the default task from the build script
export { default } from './tasks/build.js';

// Load all task files from the "tasks" folder
// const tasksDir = join(import.meta.dirname, 'tasks');

// Synchronously register tasks
/* readdirSync(tasksDir)
  .filter(file => file.endsWith('.js')) // Only include JavaScript files
  .forEach(async (file) => {
    const task = await import(join(tasksDir, file)); // Dynamically import each task file
    Object.entries(task).forEach(([name, exported]) => {
      if (name !== 'default') {
        gulp.task(name, exported); // Register the task with Gulp
      }
    });
  }); */

export * from './tasks/build.js';
export * from './tasks/deploy.js';
