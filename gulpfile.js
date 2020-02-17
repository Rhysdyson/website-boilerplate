/*
  By Rhys Dyson | License: BSD-3-Clause | https://rhysdyson.com

  GULP FILE EXPLANATION
  This is a default script to convert all developer files into the public directory,
  only the public directory should be uploaded to the web server.

  USAGE:
  Install required packages: npm-install-all gulpfile.js
  Run 'gulp' in the developer (this) directory to begin. Press ctrl+c to end.

  COMMANDS:

    gulp (default):
    1. cssTask: Compile main.{scss,sass}, compress the css, deliver main.css to public directory.
    2. jsTask: Concatenate script files, compress the script, deliver main.js to public directory.
    3. iconTask: Compress icon files, deliver to public directory.
    4. imageTask: Compress image files, deliver to public directory.
    5. cacheBustTask: Change the css and js file names in index.html to force browser refresh.
    6. watchTask: Checks for any sass, scss or js file changes, then re-runs the code compilers and cachebuster.

    img
    1. imageTask: Compress all images, deliver to public directory.

    clean
    1. Deletes code and image files from public directory.
    2. Runs code compiles and delivers to public directory.
    3. Runs image compression.

    watch
    1. Checks for any sass, scss or js file changes, then re-runs the code compilers and cachebuster.

*/

/* ===================================
        INITIALISATION & VARS
=================================== */

// GULP INITIALISATION
const { src, dest, watch, series, parallel } = require('gulp');
const clean = require ('gulp-clean');

// PACKAGE IMPORTS | npm install --save-dev package_name | npm uninstall --save-dev package_name
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
var replace = require('gulp-replace');

// FILE PATHS
const path = {

  // Index
  index: '_public/index.html',

  // Styles
  sass: 'assets/css/**/*.{scss,sass}', // All developer sass files for the watch task
  sassInput: 'assets/css/main.{scss,sass}', // Get sass @import file from developer directory
  cssOutput: '_public/css', // Deliver main.css to public directory

  // Scripts
  jsInput: 'assets/js/**/*.js', // Get all js files from developer directory
  jsOutput: '_public/js', // Deliver main.js to public directory

  // Images
  imageInput: 'assets/images/**/*', // Get all image files from developer directory
  imageOutput: '_public/img', // Deliver compressed images to public directory

  // Icons
  iconInput: 'assets/icons/**/*', // Get all image files from developer directory
  iconOutput: '_public/ico' // Deliver compressed images to public directory

}

/* ===================================
              COMMANDS
=================================== */

/*
  COMMAND: "gulp"
  Cleans public directory, recompiles code and runs watch task on loop for development.
  Run this for a new and current development session, use other functions as necessary.
*/
exports.default = series(
    codeClean,
    series(scssTask, jsTask),
    cacheBustTask,
    imageClean,
    iconTask,
    imageTask,
    watchTask
);

/*
  COMMAND: "gulp img"
  Runs the image compression function.
*/
exports.img = series(
  iconTask,
  imageTask
);

/*
  COMMAND: "gulp clean"
  Deletes all public directories, and re-runs all scripts to replace them-removing any deleted files.
*/
exports.clean = series(
  codeClean, // Delete files
  imageClean,
  scssTask, // Recompile code
  jsTask,
  iconTask, // Recompress images
  imageTask
);

/*
  COMMAND: "watch"
  Deletes all public directories, and re-runs all scripts to replace them-removing any deleted files.
*/
exports.watch = series(
  series(scssTask, jsTask),
  cacheBustTask,
  watchTask
);

/* ===================================
          TASKS / FUNCTIONS
=================================== */

/*
  CSS TASK:
  Compile main.{scss,sass} [developer directory] into main.css [public directory].
*/
function scssTask() {
  console.log('\n Compiling and compressing styles... \n');
  return src(path.sassInput)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(path.cssOutput)
  );
}

/*
  SCRIPT TASK:
  Concatenate main.js [developer directory] into main.js [public directory].
*/
function jsTask(){
  console.log('\n Concatenating and compressing scripts... \n');
  return src([
      path.jsInput
      //, '!' + 'assets/js/1-setup/*.min.js', // Exclude a file
      ])
      .pipe(concat('main.js'))
      .pipe(uglify())
      .pipe(dest(path.jsOutput)
  );
}

/*
  CACHEBUST TASK:
  Changes CSS and JS file names in index.html [public directory] to help browser refresh.
*/
function cacheBustTask(){
  var cbString = new Date().getTime();
  return src(path.index)
      .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
      .pipe(dest('.'));
}

/*
  WATCH TASK:
  Checks for any CSS or JS file updates. If so, re-runs the script. Runs indefinitely.
*/
function watchTask(){
  console.log('\n Watching for file changes... \n');
  watch([
    path.sass,
    path.jsInput,
  ],
      {interval: 1000, usePolling: true}, //Makes docker work
      series(
          parallel(scssTask, jsTask),
          cacheBustTask
      )
  );
}

/*
  ICON TASK:
  Compresses files in the developer directory, and delivers them in the public directory.
*/
function iconTask() {
  console.log('\n Compressing icons... \n');
  return src(path.iconInput)
      .pipe(imagemin())
      .pipe(dest(path.iconOutput)
  );
}

/*
  IMAGE TASK:
  Compresses files in the developer directory, and delivers them in the public directory.
*/
function imageTask() {
  console.log('\n Compressing images... \n');
  return src(path.imageInput)
      .pipe(imagemin())
      .pipe(dest(path.imageOutput)
  );
}

/*
  CODE CLEAN TASK:
  Delete code folders from public directory
*/
function codeClean(){
  console.log('\n Removing css and js folders... \n');
  return src(path.cssOutput, { allowEmpty: true }),
         src(path.jsOutput, { allowEmpty: true })
         .pipe(clean({ force: true }) // Force allows clean to run outside the current directory.
  );
}

/*
  IMAGE CLEAN TASK:
  Deleted image folders from public directory
*/
function imageClean(){
  console.log('\n Removing img and ico folders... \n');
  return src(path.imageOutput, { allowEmpty: true }),
         src(path.iconOutput, { allowEmpty: true })
         	.pipe(clean({ force: true }) // Force allows clean to run outside the current directory.
  );
}
