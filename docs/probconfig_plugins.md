# Problem Configuration Plugins

This document provides a description of all the SketchResponse plugins and how
to declare them. Declaring any plugin in a grader's problem configuration
enables the selection of that plugin in the javascript front-end tool.

Any of these plugins can be declared multiple times causing
multiple instances of the plugin to be enabled in the javascript tool. See
the [Complex Grader Example](complex_grader.md) for an example where this
is used.

## Table of Contents

* [Axes](#axes)
* [Background](#background)
* [Freeform](#freeform)
* [Point](#point)
* [Line Segment](#line-segment)
* [Vertical Asymptote](#vert-line)
* [Horizontal Asymptote](#horiz-line)
* [Image](#image)
* [Stamp](#stamp)
* [PolyLine](#polyline)

<div id=axes></div>
## Axes

Adds horizontal and vertical axes, and a grid system. It has one parameter that must be defined:

* `'name': 'axes'` - the name key *must* have the value 'axes'.

It also has optional parameters that depend on the 'coordinates' option defined one level up:

If 'cartesian' is chosen, the following parameters will take effect:

* `'xmajor': <number>(default: none)` - the major tick spacing for the x axis
* `'ymajor': <number>(default: none)` - the major tick spacing for the y axis
* `'xminor': <number>(default: none)` - the minor tick spacing for the x axis
* `'yminor': <number>(default: none)` - the minor tick spacing for the y axis

Note: if some (or all) of the above are missing, an automatic, best-fitting value will be generated as a default.

If 'polar' is chosen, the following parameters will take effect:

* `'rrange': <number>(default: 10)` - the distance between the origin and the outer circle
* `'rmajor': <number>(default: 1)` - the distance between the circles of the polar grid
* `'thetamajor': <number>(default: 30)` - the angle (in degrees) between the rays of the polar grid

E.g.

```python
{'name': 'axes', 'rrange': '20', 'rmajor': '5', thetamajor: '10'}
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
four parameters that must be defined:

* `'name': 'freeform'` - the name key *must* have the value 'freeform'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).

E.g.

```python
{'name': 'freeform', 'id': 'f', 'label': 'Function f(x)', 'color':'blue'}
```

<div id=point></div>
## Point

The Point plugin adds a button to the tool to draw points on the axes. It has five
parameters that must be defined:

* `'name': 'point'` - the name key *must* have the string value 'point'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'size': <int>` - the size key must be given an integer value. It sets the
pixel diameter of the point drawn by the plugin.

It also has an optional parameter:

* `'hollow': <boolean>` - if set to true, the point will be drawn hollow. Default value: false.

E.g.

```python
{'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15, 'hollow': True}
```

<div id=line-segment></div>
## Line Segment

The Line Segment plugin adds a button to the tool to draw line segments on the axes. Optionally these can have a customizable arrow head and can be constrained in their direction (horizontally or vertically) and their length.
The plugin behaves as follows:

* Pointer press and then drag will create a dynamic line segment from initial press location to current drag location. On drag release, the line segment will be drawn from initial press to drag release.

* Pointer click will create a point. Two behaviors are then possible:

  * A subsequent pointer click will create a line segment from first pointer click to second pointer click.

  * A subsequent pointer press and drag will create a dynamic line segment from initial click location to current drag location. On drag release, the line segment will be drawn from initial click to drag release.

It has five parameters that must be defined:

* `'name': 'line-segment'` - the name key *must* have the value 'line-segment'.
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.

It also has optional parameters:

* `'directionConstraint': <a constraint string>` - the directionConstraint key should be a string describing the constraint. Possible values: 'horizontal', 'vertical'.

* `'lengthConstraint': <int>` - the lengthConstraint key must be given an integer value. It sets the
maximum pixel length of the line segment drawn by the plugin.

* `'arrowHead': <object>` - the arrowHead key must be an object containing the following keys:
  * `'length': <int>` - the length key must be given an integer value. It sets the length of the arrow head of the line segment drawn by the plugin.
  * `'base': <int>` - the base key must be given an integer value. It sets the base width of the arrow head of the line segment drawn by the plugin.

E.g.

```python
{'name': 'line-segment', 'id': 'ls', 'label': 'Line segment', 'color': 'gray', 'dashStyle': 'solid', 'directionConstraint': 'horizontal', 'lengthContraint': 50, 'arrowHead': {'length': 10, 'base': 7}
```

<div id=vert-line></div>
## Vertical Asymptote

The Vertical Asymptote plugin adds a button to  the tool to draw vertical lines on the
axes. It has five parameters that must be defined:

* `'name': 'vertical-line'` - the name key *must* have the value 'vertical-line'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.

E.g.

```python
{'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
```

<div id=horiz-line></div>
## Horizontal Asymptote

The Horizontal Asymptote plugin adds a button to  the tool to draw horizontal lines on the
axes. It has five parameters that must be defined:

* `'name': 'horizontal-line'` - the name key *must* have the value
'horizontal-line'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.

E.g.

```python
{'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
```

<div id=image></div>
## Image

Adds an image to the drawing canvas.

* `'name': 'image'` - the name key *must* have the value 'image'
* `'scale': <number>(default: 1)` - multiplier to scale the size of the image.
* `'align': <alignment string>(default: '')` - possible values, 'top', 'left', 'bottom', 'right', ''.
* `'offset': [<number>,<number>]` - array of x, y offsets (default value[0, 0]).
* `'src': <path to image file>` - the path to the image file to insert.

E.g.

```python
{'name': 'image', 'align': 'bottom', 'src': '/static/image.png'}
```

<div id=stamp></div>
## Stamp

The Stamp plugin adds a button to the tool to draw a custom image to the canvas that can be positioned like a Point.

* `'name': 'stamp'` - the name key *must* have the value 'stamp'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'scale': <number>(default: 1)` - multiplier to scale the size of the image.
* `'width': <number>(default: '100')` - the pixel width of the image.
* `'height': <number>(default: '100')` - the pixel height of the image.
* `'src': <path to image file>` - the path to the image file to insert.

E.g.

```python
{'name': 'stamp', 'id': 'st', 'label': 'Stamp', 'src': '/static/image.png'}
```

<div id=polyline></div>
## PolyLine/Polygon

The PolyLine plugin adds a button to the tool to draw a PolyLine or Polygon by
placing the points that define its component line segments. It has seven
parameters that must be defined:

* `'name': 'polyline'` - the name key *must* have the value
'polyline'
* `'id': <unique identifier string>` - the id key *must* have a *unique* value.
This value is used as the key for the data created by this plugin in the JSON
string returned to the grader function.
* `'label': <descriptive string>` - the label key should be given a descriptive string. This string will be used to label the selection button in the javascript
front-end tool.
* `'closed': <'true'|'false'>` - true if you want a polygon, false if you want a polyline.
* `'color': <a color string>` - the color key should be give a color string that
javascript recognizes. A listing of color names can be found [here](http://www.w3schools.com/colors/colors_names.asp).
* `'fillColor': <a color string>` - the fillColor is used if the 'closed' parameter is true.
* `'dashStyle': <line dash string>(default: 'solid')` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid'.

E.g.

```python
{'name': 'polyline', 'id': 'pl', 'label': 'PolyLine', 'closed': 'true', 'color': 'gray', 'fillColor': 'lightblue', 'dashStyle': 'dashdotted'}
```
