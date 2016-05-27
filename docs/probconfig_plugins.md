# Problem Configuration Plugins

This document provides a description of all the SketchResponse plugins and how
to declare them. Declaring any plugin in a grader's problem configuration
enables the selection of that plugin in the javascript front-end tool.

Any of these plugins can be declared multiple times causing
multiple instances of the plugin to be enabled in the javascript tool. See
the [Complex Grader Example](docs/complex_grader.md) for an example where this
is used.

## Table of Contents

* [Axes](#axes)
* [Background](#background)
* [Freeform](#freeform)
* [Point](#point)
* [Vertical Asymptote](#vert-line)
* [Horizontal Asymptote](#horiz-line)
* [Image](#image)

<div id=axes></div>
## Axes

Adds horizontal and vertical axes with major and minor ticks and their associated gridlines.

* `'name': 'axes'` - the name key *must* have the value 'axes'
* `'xmajor': <number>(default: 1)` - the major tick spacing for the x axis
* `'ymajor': <number>(default: 1)` - the major tick spacing for the y axis
* `'xminor': <number>(default: 0.25)` - the minor tick spacing for the x axis
* `'yminor': <number>(default: 0.25)` - the minor tick spacing for the y axis

E.g.

```python
{'name': 'axes'}
```

<div id=background></div>
## Background

Sets the background image for the drawing canvas. The default is an grid.

E.g.

```python
{'background': '/static/app/axes.png'}
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

E.g.

```python
{'name': 'point', 'id': 'cp', 'label': 'Extremum', 'color': 'black', 'size': 15}
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
* `'dashStyle': <line dash string>` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid' (default: 'dashdotted').

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
* `'dashStyle': <line dash string>` - the dashStyle key should have a string
description of the dash style to used for drawing the line. Possible values: 'dashed', 'longdashed', 'dotted', 'dashdotted', 'solid' (default: 'dashdotted').

```python
{'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
```

<div id=image></div>
## Image

Adds an image to the drawing canvas.

* `'name': 'image'` - the name key *must* have the value 'image'
* `'scale': <number>(default: 1)` - multiplier to scale the size of the image.
* `'align': <alignment string>` - possible values, 'top', 'left', 'bottom', 'right', '' (default value))
* `'offset': [<number>,<number>]` - array of x, y offsets (default value[0, 0]).

