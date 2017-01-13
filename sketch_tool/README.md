# Sketch Tool
#### A configurable Javascript front-end drawing tool with plugin components.


### Prerequisites

You'll need to have [Node.js](http://nodejs.org) and npm (which is now packaged with Node) to be installed on your system.


### Installation

* Change to the *sketch_tool* directory:

  ```sh
  $ cd sketchresponse/sketch_tool
  ```

* Install dependencies listed in *package.json*:

  ```sh
  $ npm install
  ```
  [JSPM](http://jspm.io) will pull in additional dependencies automatically on a post-install script.


### Usage

* Change to the *sketch_tool* directory:

  ```sh
  $ cd sketchresponse/sketch_tool
  ```

* To start the development server:

  ```sh
  $ npm run start
  ```
  Then point your browser to the following address: http://localhost:4567/#debug:config1

  This will load the tool with options listed in the config1 object in the following [`file`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/html/debugConfigs.js).

  Options are:
  * width, height: dimensions of the tool.
  * xrange, yrange: dimension of the drawing canvas.
  * xscale, yscale: linear or logarithmic scales. Only linear is supported for the moment.
  * plugins: modules that extend drawing functionality either automatically (for example axes, background and image) or are placed in the top toolbar (freeform, horizontal and vertical lines) and let the user draw the corresponding shape on the canvas.


* To build the *sketchresponse/static/sketch_tool_dist* directory:

  ```sh
  $ npm run build
  ```

### Plugins
They are located in the following [`directory`](https://github.com/SketchResponse/sketchresponse/tree/master/sketch_tool/lib/plugins/).
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

NPM modules (see [`package.json`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/package.json))
* [`autoprefixer`](https://www.npmjs.com/package/autoprefixer)
* [`fast-sourcemap-concat`](https://www.npmjs.com/package/fast-sourcemap-concat)
* [`glob`](https://www.npmjs.com/package/glob)
* [`gobble`](https://www.npmjs.com/package/gobble)
* [`jspm`](https://www.npmjs.com/package/jspm)
* [`node-sass`](https://www.npmjs.com/package/node-sass)
* [`postcss-cli`](https://www.npmjs.com/package/postcss-cli)

JSPM fetched modules (see [`config.js`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/config.js))

### License

Please refer to the [LICENSE file](https://github.com/SketchResponse/sketchresponse/blob/master/LICENSE) in the root of the SketchResponse repository.
