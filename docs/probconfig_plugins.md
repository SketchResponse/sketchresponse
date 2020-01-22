# Problem Configuration Plugins

This document provides a description of all the SketchResponse problem configuration parameters and how
to declare them. Declaring any plugin in a grader's problem configuration
enables the selection of that plugin in the javascript front-end tool.

Any of these plugins can be declared multiple times causing
multiple instances of the plugin to be enabled in the javascript tool. See
the [Complex Grader Example](complex_grader.md) for an example where this
is used.

## Table of Contents

* [Main](#main)
* [Axes](#axes)
* [Background](#background)
* [Freeform](#freeform)
* [Horizontal Line](#horiz-line)
* [Image](#image)
* [Line Segment](#line-segment)
* [Point](#point)
* [PolyLine](#polyline)
* [Spline](#spline)
* [Stamp](#stamp)
* [Vertical Line](#vert-line)
* [Initial State](#initialstate)

<div id=main></div>
## Main
The main section of the problem configuration contains parameters that affect the
overall look of the sketch tool. The main section should only be declared once
per problem configuration, unlike plugins, which can be declared mulitple times.

* `'width': <integer>` - The width of the drawing canvas in pixels.
* `'height': <integer>` - The height of the drawing canvas in pixels.
* `'xrange': [<number>, <number>]` - The numerical range of the x axis.
* `'yrange': [<number>, <number>]` - The numerical range of the y axis.
* `'xscale': 'linear'` - Currently only linear. 
* `'yscale': 'linear'` - Currently only linear.
* `'coordinates': <'cartesians'|'polar'>` - The type of axes to draw.
* `'debug': <True|False>` - If true prints debug information about the problem configuration to your browser's developer console.

<div id=axes></div>
## Axes

Adds horizontal and vertical axes, and a grid system. It has one parameter that must be defined:

* `'name': 'axes'` - the name key *must* have the value 'axes'.

It also has optional parameters that depend on the 'coordinates' option defined one level up:

If 'cartesian' is chosen, the following parameters will take effect:

* `'xmajor': <number>(default: none)` - the major tick spacing for the x axis.
* `'ymajor': <number>(default: none)` - the major tick spacing for the y axis.
* `'xminor': <number>(default: none)` - the minor tick spacing for the x axis.
* `'yminor': <number>(default: none)` - the minor tick spacing for the y axis.
* `'xlabels': <number>(default: none)` - the label spacing for the x axis.
* `'ylabels': <number>(default: none)` - the label spacing for the y axis.
* `'major': <number>(default: none)` - the major tick spacing for the x and y axis.
* `'minor': <number>(default: none)` - the minor tick spacing for the x and y axis.
* `'labels': <number>(default: none)` - the label spacing for the x and y axis.

Note: if some (or all) of the above are missing, an automatic, best-fitting value will be generated as a default.

* `'strokeWidth': <object>` - the strokeWidth key must be an object containing the following keys:
  * `'xmajor': <int>(default: 2)` - an integer defining the stroke width in pixels of the vertical major lines.
  * `'ymajor': <int>(default: 2)` - an integer defining the stroke width in pixels of the horizontal major lines.
  * `'xminor': <int>(default: 1)` - an integer defining the stroke width in pixels of the vertical minor lines.
  * `'yminor': <int>(default: 1)` - an integer defining the stroke width in pixels of the horizontal minor lines.
* `'colors': <object>` - the colors key must be an object containing the following keys:
  * `'xmajor': <string>(default: '#f0f0f0')` - a string defining the color of the major vertical lines.
  * `'ymajor': <string>(default: '#f0f0f0')` - a string defining the color of the major horizontal lines.
  * `'xminor': <string>(default: '#f6f6f6')` - a string defining the color of the minor vertical lines.
  * `'yminor': <string>(default: '#f6f6f6')` - a string defining the color of the minor horizontal lines.
  * `'xlabels': <string>(default: '#333')` - a string defining the color of the x axis labels.
  * `'ylabels': <string>(default: '#333')` - a string defining the color of the y axis labels.
  * `'zeroLabel': <string>(default: '#333')` - a string defining the color of the origin label.
* `'fontSize': <object>` - the fontSize key must be an object containing the following keys:
  * `'xlabels': <int>(default: 14)` - an integer defining the font size of the x axis labels.
  * `'ylabels': <int>(default: 14)` - an integer defining the font size of the y axis labels.
  * `'zeroLabel': <int>(default: 14)` - an integer defining the font size of the origin label.

If 'polar' is chosen, the following parameters will take effect:

* `'rrange': <number>(default: 10)` - the distance between the origin and the outer circle.
* `'rmajor': <number>(default: 1)` - the distance between the circles of the polar grid.
* `'thetamajor': <number>(default: 30)` - the angle (in degrees) between the rays of the polar grid.
* `'strokeWidth': <object>` - the strokeWidth key must be an object containing the following keys:
  * `'circle': <int>(default: 2)` - an integer defining the stroke width in pixels of the circles.
  * `'ray': <int>(default: 2)` - an integer defining the stroke width in pixels of the rays.
* `'colors': <object>` - the colors key must be an object containing the following keys:
  * `'circle': <string>(default: '#f0f0f0')` - a string defining the color of the circles.
  * `'ray': <string>(default: '#f0f0f0')` - a string defining the color of the rays.

It also has optional parameters that do NOT depend of the 'coordinates' option defined one level up:

* `'strokeWidth': <object>` - the strokeWidth key must be an object containing the following keys:
  * `'xaxis': <int>(default: 1)` - an integer defining the stroke width in pixels of the x axis.
  * `'yaxis': <int>(default: 1)` - an integer defining the stroke width in pixels of the y axis.
* `'colors': <object>` - the colors key must be an object containing the following keys:
  * `'xaxis': <string>(default: '#333')` - a string defining the color of the x axis.
  * `'yaxis': <string>(default: '#333')` - a string defining the color of the y axis.
  * `'xaxisLabel': <string>(default: '#333')` - a string defining the color of the x axis label.
  * `'yaxisLabel': <string>(default: '#333')` - a string defining the color of the y axis label.
* `'fontSize': <object>` - the fontSize key must be an object containing the following keys:
  * `'xaxisLabel': <int>(default: 14)` - an integer defining the font size of the x axis label.
  * `'yaxisLabel': <int>(default: 14)` - an integer defining the font size of the y axis label.
* `'xaxisLabel': <object>` - the xaxisLabel key must be an object containing the following keys:
  * `'value': <string>` - the string to label the x axis with.
  * `'dx': <int>` - a pixel offset in the x direction.
  * `'dy': <int>` - a pixel offset in the y direction.
* `'yaxisLabel': <object>` - the yaxisLabel key must be an object containing the following keys:
  * `'value': <string>` - the string to label the y axis with.
  * `'dx': <int>` - a pixel offset in the x direction.
  * `'dy': <int>` - a pixel offset in the y direction.

E.g.

```python
{'name': 'axes', 'rrange': '20', 'rmajor': '5', 'thetamajor': '10'}
```

<div id=background></div>
## Background
### [Deprecated] - Use the image plugin instead.

Sets the background image for the drawing canvas. The default is an grid.

* `'name': 'background'` - the name key *must* have the value 'background'
* `'src': <path to file>` - a path string to the image file to use

E.g.

```python
{'name': 'background'
 'src': '/static/app/axes.png'}
```

<div id=freeform></div>
## Freeform

The Freeform plugin adds a button to  the tool to draw freeform lines on the axes. It has
two parameters that must be defined:

* `'name': 'freeform'` - the name key *must* have the value 'freeform'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Freeform')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=horiz-line></div>
## Horizontal Line

The Horizontal Line plugin adds a button to  the tool to draw horizontal lines on the
axes. It has two parameters that must be defined:

* `'name': 'horizontal-line'` - the name key *must* have the value
'horizontal-line'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Horizontal line')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=image></div>
## Image

Adds an image to the drawing canvas. It has two parameters that must be defined:

* `'name': 'image'` - the name key *must* have the value 'image'.
* `'src': <path to image file>` - the path to the image file to insert.

It also has optional parameters:

* `'scale': <number>(default: 1)` - multiplier to scale the size of the image.
* `'align': <alignment string>(default: '')` - possible values, 'top', 'left', 'bottom', 'right', ''.
* `'offset': [<number>,<number>]` - array of x, y offsets (default value[0, 0]).

E.g.

```python
{'name': 'image', 'align': 'bottom', 'src': '/static/image.png'}
```

<div id=line-segment></div>
## Line Segment

The Line Segment plugin adds a button to the tool to draw line segments on the axes. Optionally these can have a customizable arrow head and can be constrained in their direction (horizontally or vertically) and their length.
The plugin behaves as follows:

* Pointer press and then drag will create a dynamic line segment from initial press location to current drag location. On drag release, the line segment will be drawn from initial press to drag release.

* Pointer click will create a point. Two behaviors are then possible:

  * A subsequent pointer click will create a line segment from first pointer click to second pointer click.

  * A subsequent pointer press and drag will create a dynamic line segment from initial click location to current drag location. On drag release, the line segment will be drawn from initial click to drag release.

It has two parameters that must be defined:

* `'name': 'line-segment'` - the name key *must* have the value 'line-segment'.
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Line segment')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.
* `'directionConstraint': <a constraint string>` - the directionConstraint key should be a string describing the constraint. Possible values: 'horizontal', 'vertical'.
* `'lengthConstraint': <int>` - the lengthConstraint key must be given an integer value. It sets the
maximum pixel length of the line segment drawn by the plugin.
* `'arrowHead': <object>` - the arrowHead key must be an object containing the following keys:
  * `'length': <int>` - the length key must be given an integer value. It sets the length of the arrow head of the line segment drawn by the plugin.
  * `'base': <int>` - the base key must be given an integer value. It sets the base width of the arrow head of the line segment drawn by the plugin.
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
  * `'position': <string>` - a string defining where to draw the tag along the length of the line segment. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'line-segment', 'id': 'ls', 'label': 'Line segment', 'color': 'gray', 'dashStyle': 'solid', 'directionConstraint': 'horizontal', 'lengthContraint': 50, 'arrowHead': {'length': 10, 'base': 7}, 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start', 'position': 'end'}}
```

<div id=point></div>
## Point

The Point plugin adds a button to the tool to draw points on the axes. It has two
parameters that must be defined:

* `'name': 'point'` - the name key *must* have the string value 'point'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Point')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray`) - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'size': <int>(default: 15)` - the size key must be given an integer value. It sets the
pixel diameter of the point drawn by the plugin.
* `'hollow': <True|False>(default: False)` - if set to True, the point will be drawn hollow. Default value: False.
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15, 'hollow': True, 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=polyline></div>
## PolyLine/Polygon

The PolyLine plugin adds a button to the tool to draw a PolyLine or Polygon by
placing the points that define its component line segments. It has two
parameters that must be defined:

* `'name': 'polyline'` - the name key *must* have the value
'polyline'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Polyline')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.
* `'closed': <True|False>(default: False)` - True if you want a polygon, False if you want a polyline.
* `'fillColor': <a color string>(default: 'none')` - the fillColor is used if the 'closed' parameter is set to True.
* `'opacity': <a color string>(default: 1)` - sets the opacity of the polyline. Range is from 0 (invisible) to 1 (opaque).
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'polyline', 'id': 'pl', 'label': 'PolyLine', 'closed': True, 'color': 'gray', 'fillColor': 'lightblue', 'dashStyle': 'dashdotted', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=spline></div>
## Spline

The Spline plugin adds a button to the tool to draw a sequence of points between which a spline is interpolated. It has two parameters that must be defined:

* `'name': 'spline'` - the name key *must* have the value 'spline'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default 'Spline')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'spline', 'id': 'spl', 'label': 'Function f(x)', 'color':'royalblue', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=stamp></div>
## Stamp

The Stamp plugin adds a button to the tool to draw a custom image to the canvas that can be positioned like a Point. It has two parameters that must be defined:

* `'name': 'stamp'` - the name key *must* have the value 'stamp'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(default: 'Stamp')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'scale': <number>(default: 1)` - multiplier to scale the size of the image.
* `'imgwidth': <number>(default: '100')` - the pixel width of the image.
* `'imgheight': <number>(default: '100')` - the pixel height of the image.
* `'iconSrc': <path to image file>` - the path to the toolbar icon.
* `'src': <path to image file>` - the path to the image file to insert.
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'stamp', 'id': 'st', 'label': 'Stamp', 'src': '/static/image.png', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=vert-line></div>
## Vertical Line

The Vertical Line plugin adds a button to  the tool to draw vertical lines on the
axes. It has two parameters that must be defined:

* `'name': 'vertical-line'` - the name key *must* have the value 'vertical-line'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.

It also has optional parameters:

* `'label': <descriptive string>(Default: 'Vertical line')` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>(default: 'dimgray')` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.
* `'tag': <object>` - the tag key must be an object containing the following keys:
  * `'value': <string>` - the intial value of the tag when the data is drawn on the canvas.
  * `'xoffset': <int>` - the pixel offset in the x direction.
  * `'yoffset': <int>` - the pixel offset in the y direction.
  * `'align': <string>` - a string defining the position of the tag from which the offsets are applied. May be 'start'|'middle'|'end'.
* `'readonly': <True|False>(default: False)` - if True marks the plugin as readonly and not available in the toolbar and any data in the initialstate from this plugin is drawn to the canvas in a non-editable form.

E.g.

```python
{'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle': 'dashdotted', 'tag': {'value': 'tag', 'xoffset': 15, 'yoffset': 15, 'align': 'start'}}
```

<div id=initialstate></div>
## Initial State

While not strictly a plugin, the initial state configuration parameter can be used to set data to predrawn to a canvas using declared plugins. In the problem configuration, it is declared at the same level as the 'plugins' tag.

The initial state data can be automatically generated using the [local testing server](local_test.md), copying and pasting the output into the grader script after manually drawing the initial state data using the sketch tool. If you do not want initial state data to be editable after the fact, you can mark the plugins used to generate the intial state data as 'readonly' and they will not be accessible in the toolbar and the data drawn on the canvas will not be editable.

E.g.
The initial state configuration below uses a point plugin with id 'pt' to initialize two points at the given pixel positions on the canvas.

```python
'initialstate': {
  "pt": [
    {
      "x": 93,
      "y": 41
    },
    {
      "x": 563,
      "y": 293
    }
  ]
```
