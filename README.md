SketchResponse
===========

SketchResponse is a Javascript/Python(2.5-2.7) tool for drawing and evaluating
mathematical functions. It was designed for use with the edX online
courseware platform. However, it is a self-contained application that can be
integrated into other web platforms.

Features
--------

- Sketch Tool - configurable Javascript front-end with plugin components to provide different
function drawing and annotation capabilities. See
[Sketch-Tool Plugin Configuration](docs/probconfig_plugins.md) for a description of the available
plugins.
- Grader Library - python back-end that provides an API of function grading methods that
can be composed to construct custom grading scripts. See
[Create a Simple Grading Script](docs/simple_grader.md) for a tutorial on building
a simple grading script.

Installation
------------

* Clone this repository to the directory of your choice:
  * By using HTTPS:

    ```sh
    $ git clone https://github.com/SketchResponse/sketchresponse.git
    ```
  * By using SSH:

    ```sh
    $ git clone git@github.com:SketchResponse/sketchresponse.git
    ```

## Sketch Tool Front-End

### Prerequisites

You'll need to have [Node.js](http://nodejs.org) and npm (which is now packaged with Node) to be installed on your system.

### Installation

* Change to the *sketch_tool* directory:

  ```sh
  $ cd sketch_tool
  ```

* Install dependencies listed in *package.json*:

  ```sh
  $ npm install
  ```
  [JSPM](http://jspm.io) will pull in additional dependencies automatically on a post-install script.

## Grader Back-End

The SketchResponse grader backend has only two third party package requirements:

* [flask](http://flask.pocoo.org/)
* [numpy](http://www.numpy.org/)

Install them by running the following command in the root directory:

```sh
$ pip install -r requirements.txt
```

Flask is only required if you want to run a local server for convenience when implementing and testing new grading scripts. See the Tutorial [Test a Grading Script on a Local Server](docs/local_test.md) for details.

Usage Guides
-----------

### Examples and Tutorials
- [Grading Script Template](grader_scripts/grader_template.py)
- [Running & Building the Sketch Tool Front-end](docs/sketch_tool_usage.md)
- [Testing a Grading Script on a Local Server](docs/local_testing.md)
- Tutorial - [Create a Simple Grading Script](docs/simple_grader.md)
- Tutorial - [Create a Complex Grading Script](docs/complex_grader.md)

### Reference Information
- [Sketch-Tool Plugin Configuration](docs/probconfig_plugins.md)
- [Grader-Library API](https://SketchResponse.github.io/)


Contribute
----------

- Issue Tracker: [github.com/SketchResponse/sketchresponse/issues](https://github.com/SketchResponse/sketchresponse/issues)
- Source Code: [github.com/SketchResponse/sketchresponse/](https://github.com/SketchResponse/sketchresponse/)

## Main sketch tool dev dependencies

NPM modules (see [`package.json`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/package.json))
* [`autoprefixer`](https://www.npmjs.com/package/autoprefixer)
* [`fast-sourcemap-concat`](https://www.npmjs.com/package/fast-sourcemap-concat)
* [`glob`](https://www.npmjs.com/package/glob)
* [`gobble`](https://www.npmjs.com/package/gobble)
* [`jasmine-core`](https://www.npmjs.com/package/jasmine-core)
* [`jspm`](https://www.npmjs.com/package/jspm)
* [`karma`](https://www.npmjs.com/package/karma)
* [`node-sass`](https://www.npmjs.com/package/node-sass)
* [`phantomjs`](https://www.npmjs.com/package/phantomjs)
* [`postcss-cli`](https://www.npmjs.com/package/postcss-cli)

JSPM fetched modules (see [`config.js`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/config.js))


Support
-------

TODO
If you are having issues, please let us know.
We have a mailing list located at: $project@google-groups.com

License
-------

Copyright (c) 2016 Massachusetts Institute of Technology
All rights reserved.
