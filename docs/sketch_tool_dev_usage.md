# How to use the SketchResponse sketch tool codebase

* Change to the `sketch_tool` directory:

  ```sh
  $ cd sketch_tool
  ```

## To start the development server:

   ```sh
  $ npm run start --debug=allPlugins
  ```
  This will automatically open your default browser and load the tool with options listed in the *allPlugins* object located in [`debugConfigs.js`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/html/debugConfigs.js).

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


<div id=build></div>
## To build the *dist* directory:

  ```sh
  $ npm run build
  ```
  You can change the target browsers of the build by modifying the [BrowserList](https://github.com/browserslist/browserslist) entry in [`package.json`](https://github.com/SketchResponse/sketchresponse/blob/master/sketch_tool/package.json). Currently the target is set to the last 2 versions of every major browser excluding IE.

The dist directory is located in /static/sketch_tool_dist/.
