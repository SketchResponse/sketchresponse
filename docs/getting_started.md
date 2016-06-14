# Getting started from zero

## Prerequisites

To work with the SketchResponse codebase, there are two major technology prerequisites that you will need installed on your machine.

* The Sketch Tool front-end is built using [Node.js](http://nodejs.org) and npm (which is now packaged with Node). You will need to have both of these installed on your computer.

* The Grader Library back-end is built using [Python](https://www.python.org/) and relies on a couple python packages that you will need to install. We recommend you use the [pip](https://pypi.python.org/pypi/pip) python package installer. If you are using an up-to-date python installation you probably already have it [installed](https://pip.pypa.io/en/stable/installing/). If you already have another python package manager, we only use commonly available packages so it should not be a problem.

* You will also need to be comfortable using the command-line to execute commands.

If you have statisfied all of the above prerequisites, then we can start working on the codebase.

## Getting the codebase

* Clone this repository to the directory of your choice:
  * By using HTTPS:

    ```sh
    $ git clone https://github.com/SketchResponse/sketchresponse.git
    ```
  * By using SSH:

    ```sh
    $ git clone git@github.com:SketchResponse/sketchresponse.git
    ```

## Building the Sketch Tool front-end

* Change to the *sketch_tool* directory:

  ```sh
  $ cd sketch_tool
  ```

* Install dependencies listed in *package.json* using `npm`:

  ```sh
  $ npm install
  ```
  
  [JSPM](http://jspm.io) will pull in additional dependencies automatically on a post-install script.

* Build a distribution of the Sketch Tool. The distribution directory will be found in the `/static/sketch_tool_dist/` directory.

  ```sh
  $ npm run build
  ```

Now you have a built distribution of the Sketch Tool front-end, we will use it later to let us test grading scripts. The front-end distribution is also what you will need to have hosted on a public server when deploying SketchResponse for your application.

## Grader Library back-end dependencies

The SketchResponse grader library back-end has only two third party package requirements, which are listed in the requirements.txt file.

* [flask](http://flask.pocoo.org/)
* [numpy](http://www.numpy.org/)

You will need to be in the root directory of the codebase, then you can install them by running the following command:

```sh
$ pip install -r requirements.txt
```

Numpy is used to support the mathematical computations of the grader library.

Flask is required to run a local server for convenience when implementing and testing new grading scripts. This lets you test your scripts without having to deploy them to another server, giving you more immediate feedback and simplifying the debugging process. See the Tutorial [Test a Grading Script on a Local Server](docs/local_test.md) for details.

# What's next

Now that you have the codebase installed and ready to use, lets start looking at how to configure the Sketch Tool and implement a couple grading scripts. Click [here](using_sr.md).