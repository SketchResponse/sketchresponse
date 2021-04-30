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
  $ npm ci
  ```


### Usage

* Change to the *sketch_tool* directory:

  ```sh
  $ cd sketchresponse/sketch_tool
  ```

* To start the development server:

  ```sh
  $ npm run start --debug=allPlugins
  ```
  This will automatically open your default browser and load the tool with options listed in the `allPlugins` object located in [`debugConfigs.js`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/html/debugConfigs.js).

  Options are:
  * *width, height:* dimensions of the tool.
  * *xrange, yrange:* dimension of the drawing canvas.
  * *xscale, yscale:* linear or logarithmic scales. Only linear is supported for the moment.
  * *coordinates:* cartesian or polar.
  * *plugins:* modules that extend drawing functionality either automatically (for example axes and image) or are placed in the top toolbar (freeform, horizontal and vertical lines) and let the user draw the corresponding shape on the canvas.

  You can also load these additional configurations which show various features of the tool:
  * allPluginsLatex
  * initialState
  * axesParams
  * tagPosition
  * newPlugins
  * invalidConfig
  * pluginGroup

* To use [ESLint](https://eslint.org) on the JS code located in `sketch_tool/lib`:
  ```sh
  $ npm run lint:js
  ```
* To use [StyleLint](https://stylelint.io) on the SCSS (or CSS) code located in `sketch_tool/styles`:
  ```sh
  $ npm run lint:css
  ```

* To build the *sketchresponse/static/sketch_tool_dist* directory:

  ```sh
  $ npm run build
  ```
  You can change the target browsers of the build by modifying the [BrowserList](https://github.com/browserslist/browserslist) entry in [`package.json`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/package.json). Currently the target is set to the last 2 versions of every major browser excluding IE.


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
* [`Autoprefixer`](https://www.npmjs.com/package/autoprefixer)
* [`Babel`](https://babeljs.io)
* [`ESLint`](https://eslint.org)
* [`node-sass`](https://www.npmjs.com/package/node-sass)
* [`PostCSS`](https://postcss.org)
* [`StyleLint`](https://stylelint.io)
* [`Webpack`](https://webpack.js.org)


### License

Please refer to the [LICENSE file](https://github.com/SketchResponse/sketchresponse/blob/master/LICENSE) in the root of the SketchResponse repository.
