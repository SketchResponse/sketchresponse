Sketch2
=======

A graphical input tool for the edX platform.


Installation
------------
Clone this repository, then `npm install`. You'll need to have [Node.js](http://nodejs.org) and npm (which is now packaged with Node) installed on your system.


Tests
-----
`npm test`

Note that the test runner ([Karma](http://karma-runner.github.io)) will try to start Google Chrome to run the tests. To use a different browser, edit `karma.conf.js`.


Dev Tasks
---------
This project uses [gulp](http://gulpjs.com/) for running development tasks. You may want to install the gulp CLI globally for convenience (`npm install -g gulp`) or just add `./node_modules/.bin/` to your `$PATH`. For a list of available tasks, see `gulpfile.js`.

The default gulp task ("`gulp`") does several useful things:

* cleans up some previously compiled files (e.g., `./css`)
* automatically watches and recompiles Sass files
* starts Karma to run tests automatically when the script files change
* starts [BrowserSync](http://www.browsersync.io/) to serve the project files with live reload


Deploying
---------

[TODO] The project will eventually include a way to bundle and minify all the scripts, minify the CSS, etc.
