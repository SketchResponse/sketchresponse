# Problem Configuration Plugins

This document provides a description of all the SketchResponse plugins and how
to declare them. Declaring any plugin in a grader's problem configuration
enables the selection of that plugin in the javascript front-end tool.

Any of these plugins can be declared multiple times causing
multiple instances of the plugin to be enabled in the javascript tool. See
the [Complex Grader Example](/complex_grader.md) for an example where this
is used.

## Table of Contents

* [Axes](#axes)
* [Freeform](#freeform)
* [Point](#point)
* [Vertical Asymptote](#vert-line)
* [Horizontal Asymptote](#horiz-line)

## Axes
<div id=axes></div>

*The Axes plugin must be declared.* It enables the axes on which the other
plugins can interact. It has one parameter that must be defined:

* `'name': 'axes'` - the name key *must* have the value 'axes'

E.g.

```python
{'name': 'axes'}
```

## Freeform
<div id=freeform></div>

The Freeform plugin enables the tool to draw freeform lines on the axes. It has
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

## Point
<div id=point></div>

The Point plugin enables the tool to draw points on the axes. It has five
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

## Vertical Asymptote
<div id=vert-line></div>

The Vertical Asymptote plugin enables the tool to draw vertical lines on the
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
description of the dash style to used for drawing the line. A list of acceptable
dash strings can be found [here]().

```python
{'name': 'vertical-line', 'id': 'va', 'label': 'Vertical asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
```

## Horizontal Asymptote
<div id=horiz-line></div>

The Horizontal Asymptote plugin enables the tool to draw horizontal lines on the
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
description of the dash style to used for drawing the line. A list of acceptable
dash strings can be found [here]().

```python
{'name': 'horizontal-line', 'id': 'ha', 'label': 'Horizontal asymptote', 'color': 'gray', 'dashStyle': 'dashdotted'}
```
