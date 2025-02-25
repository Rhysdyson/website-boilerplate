# Website Boilerplate (Sass & Gulp 4)

This is my personal boilerplate for web dev. Gulp compiles and compresses Sass and JS (inspired by [@thecodercoder])(https://github.com/thecodercoder/frontend-boilerplate), compresses images and places these in the [public](./_public) directory, ready for pushing.

# Tools
- Sass/Scss
- Gulp 4

# Gulp Commands

## gulp (default):
1. cssTask: Compile main.{scss,sass}, compress the css, deliver main.css to public directory.
2. jsTask: Concatenate script files, compress the script, deliver main.js to public directory.
3. iconTask: Compress icon files, deliver to public directory.
4. imageTask: Compress image files, deliver to public directory.
5. cacheBustTask: Change the css and js file names in index.html to force browser refresh.
6. watchTask: Checks for any sass, scss or js file changes, then re-runs the code compilers and cachebuster.

## img
1. imageTask: Compress all images, deliver to public directory.

## clean
1. Deletes code and image files from public directory.
2. Runs code compiles and delivers to public directory.
3. Runs image compression.

## watch
1. Checks for any sass, scss or js file changes, then re-runs the code compilers and cachebuster.

## init
1. Generates empty directories and sass/js files for assets and public directories.
