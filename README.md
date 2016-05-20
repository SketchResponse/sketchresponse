SketchResponse
===========

SketchResponse is a Javascript/Python(2.5-2.7) tool for drawing and evaluating
mathematical functions. It was designed for use with the edX online
courseware platform. However, it is a self-contained application that can be
integrated into other web platforms.

Features
--------

- Configurable Javascript front-end with plugin components to provide different
function drawing and annotation capabilities. See
[Sketch-Tool Plugin Configuration](docs/probconfig_plugins.md) for a description of the available
plugins.
- Python Grader-Library that provides an API of function grading methods that can be
composed to construct custom grading scripts. See
[Create a Simple Grading Script](docs/simple_grader.md) for a tutorial on building
a simple grading script.

Installation
------------

TODO: this is somewhat complicated and beyond my knowledge so far. The
javascript has to be hosted somewhere (the flask dev server seems to be
pulling from aws.) The python backend would have to be integrated into
whatever server infrastructure they were using as well. Exactly how you
handle the url redirections to the python graders would be dependent on
what hosting solution you are using?

### Python Dependencies

The SketchResponse grader backend has only two third party package requirements:

* [flask](http://flask.pocoo.org/)
* [numpy](http://www.numpy.org/)

And Flask is only required if you want to run a local server for convinience when implementing and testing new grading scripts. See the Tutorial [Test a Grading Script on a Local Server](docs/local_test.md) for details.

Usage Guides
-----------

### Examples and Tutorials
- [Grading Script Template](docs/grader_template.py)
- Tutorial - [Create a Simple Grading Script](docs/simple_grader.md)
- Tutorial - [Create a Complex Grading Script](docs/complex_grader.md)
- Tutorial - [Test a Grading Script on a Local Server](docs/local_testing.md)
- Tutorial - [Create a Sketch-Tool Plugin](docs/create_plugin.md)

### Reference Information
- [Sketch-Tool Plugin Configuration](docs/probconfig_plugins.md)
- [Grader-Library API](https://SketchResponse.github.io/)


Contribute
----------

- Issue Tracker: [github.com/SketchResponse/sketchresponse/issues](https://github.com/SketchResponse/sketchresponse/issues)
- Source Code: [github.com/SketchResponse/sketchresponse/](https://github.com/SketchResponse/sketchresponse/)

Support
-------

TODO
If you are having issues, please let us know.
We have a mailing list located at: $project@google-groups.com

License
-------

Copyright (c) 2016 Massachusetts Institute of Technology
All rights reserved.
