SketchResponse
===========

SketchResponse is a Javascript/Python(2.5-2.7) tool for drawing and evaluating
mathematical functions. It was designed for use with the edX online
courseware platform. However, it is a self-contained application that can be
integrated into other web platforms.

Features
--------

- Sketch Tool - configurable Javascript front-end with plugin components to provide different
function drawing and annotation capabilities. See [Sketch-Tool Usage](docs/sketch_tool_usage.md) for a description of the non-configurable interface elements of the sketch tool. See
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
- [Running & Building the Sketch Tool Front-end](docs/sketch_tool_dev_usage.md)
- [Testing a Grading Script on a Local Server](docs/local_test.md)
- Tutorial - [Create a Simple Grading Script](docs/simple_grader.md)
- Tutorial - [Create a Complex Grading Script](docs/complex_grader.md)
- Tutorial - [edX Quick Start Deployment Guide](docs/edx_quickstart.md)

### Reference Information
- [Sketch-Tool Plugin Configuration](docs/probconfig_plugins.md)
- [Grader-Library API](https://SketchResponse.github.io/sketchresponse)


Contribute
----------

Contributions to this project are very welcome! If you'd like to contribute, please open a GitHub issue and we'll get in touch.

- Issue Tracker: [github.com/SketchResponse/sketchresponse/issues](https://github.com/SketchResponse/sketchresponse/issues)
- Source Code: [github.com/SketchResponse/sketchresponse/](https://github.com/SketchResponse/sketchresponse/)

## Running tests for the Grader Library Back-end

The grader library has a collection of tests to validate the functioning of API functions. Those tests can be run from the root directory of the sketchresponse repository with the command below.

```sh
$ python -m unittest discover test_grader_lib/
```

## Rebuilding the documentation

As this project evolves, the current documentation will no longer match the existing codebase. Follow the instructions in [HowTo Build the Docs](docs/howto_build_docs.md) to rebuild as needed.


Support
-------

If you are having issues or encounter a bug, please [create a GitHub issue](https://github.com/SketchResponse/sketchresponse/issues) and we'll try to help!

License
-------

Please refer to the [LICENSE file](LICENSE) in the root of the SketchResponse repository.
