# Sketch 2
#### A graphical input tool for the edX platform.


### Prerequisites

You'll need to have [Node.js](http://nodejs.org) and npm (which is now packaged with Node) to be installed on your system.


### Installation

* Clone this repository to the directory of your choice:
  * By using HTTPS:

    ```sh
    $ git clone https://github.mit.edu/msegado/sketch2.git
    ```
  * By using SSH:

    ```sh
    $ git clone git@github.mit.edu:msegado/sketch2.git
    ```

* Change to the *sketch2* directory:

  ```sh
  $ cd sketch2
  ```

* Install dependencies listed in *package.json*:

  ```sh
  $ npm install
  ```
  [JSPM](http://jspm.io) will pull in additional dependencies automatically on a post-install script.


### Usage

* Change to the *sketch2* directory:

  ```sh
  $ cd sketch2
  ```

* To start the development server:

  ```sh
  $ npm run start
  ```
  Then point your browser to the following address: http://localhost:4567/#debug:config1

  This will load the tool with options listed in the config1 object in the following [`file`](https://github.mit.edu/msegado/sketch2/blob/master/html/debugConfigs.js).

  Options are:
  * width, height: dimensions of the tool.
  * xrange, yrange: dimension of the drawing canvas.
  * xscale, yscale: linear or logarithmic scales. Only linear is supported for the moment.
  * plugins: modules that extend drawing functionality either automatically (for example axes, background and image) or are placed in the top toolbar (freeform, horizontal and vertical lines) and let the user draw the corresponding shape on the canvas.


* To build the *dist* directory:

  ```sh
  $ npm run build
  ```

* To test:

  ```sh
  $ npm run test
  ```

### Plugins
They are located in the following [`directory`](https://github.mit.edu/msegado/sketch2/blob/master/lib/plugins/).
* **axes:**
  Adds horizontal and vertical axes with major and minor ticks and their associated gridlines. *Params:* xmajor (major x tick spacing, default value: 1), ymajor (major x tick spacing, default value: 1), xminor (minor x tick spacing, default value: 0.25), yminor (minor y tick spacing, default value: 0.25).

* **background:**
  Sets a backgound image for the drawing canvas.

* **freeform:**
  Adds a button to the toolbar that lets user draw a spline. *Params:* label (label of button), color (color of drawn spline).

* **horizontal-line & vertical-line:**
  Adds a button to the toolbar that lets user draw a horizontal/vertical line. *Params:* label (label of button), color (color of line), dashStyle (possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid' (default value)).

* **image:**
  Adds an image to the drawing canvas. *Params:* scale (default value 1), align (possible values, 'top', 'left', 'bottom', 'right', '' (default value)), offset (array of x, y offsets (default value[0, 0])).

* **point:**
  Add a button to the toolbar that lets user draw a point. *Params:* label (label of button), color (color of drawn point), size (radius of point in pixels).


### Main dev dependencies

NPM modules (see [`package.json`](https://github.mit.edu/msegado/sketch2/blob/master/package.json))
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

JSPM fetched modules (see [`config.js`](https://github.mit.edu/msegado/sketch2/blob/master/config.js))

### License
The code in this repository is under copyright from the *Massachusetts Institute of Technology, 2015, All Rights Reserved* unless otherwise noted. Please see the [`LICENSE`](https://github.mit.edu/msegado/sketch2/blob/master/LICENSE) file for details.
