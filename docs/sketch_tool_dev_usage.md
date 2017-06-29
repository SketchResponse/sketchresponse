# How to use the SketchResponse sketch tool codebase

* Change to the `sketch_tool` directory:

  ```sh
  $ cd sketch_tool
  ```

## To start the development server:

  ```sh
  $ npm run start
  ```
  Then point your browser to the following address: http://localhost:4567/#debug:allPlugins

  This will load the tool with options listed in the allPlugins object in the following [`file`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/html/debugConfigs.js).

  Options are:
  * width, height: dimensions of the tool.
  * xrange, yrange: dimension of the drawing canvas.
  * xscale, yscale: linear or logarithmic scales. Only linear is supported for the moment.
  * coordinates: cartesian or polar.
  * plugins: modules that extend drawing functionality either automatically (for example axes and image) or are placed in the top toolbar (freeform, horizontal and vertical lines) and let the user draw the corresponding shape on the canvas.

  You can also load these additional configurations which show various features of the tool:
  * http://localhost:4567/#debug:allPluginsLatex
  * http://localhost:4567/#debug:initialState
  * http://localhost:4567/#debug:axesParams
  * http://localhost:4567/#debug:tagPosition
  * http://localhost:4567/#debug:newPlugins
  * http://localhost:4567/#debug:invalidConfig


<div id=build></div>
## To build the *dist* directory:

  ```sh
  $ npm run build
  ```

The dist directory is located in /static/sketch_tool_dist/.

## To test:

  ```sh
  $ npm run test
  ```
