function loadConfig(configId) {
  var configs = {
    initialState: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'cartesian',
      plugins: [
        {
          name: 'axes',
          xaxisLabel: {
            value: 'x',
            dx: 5,
            dy: 5
          },
          yaxisLabel: {
            value: 'y',
            dx: 5,
            dy: 13
          },
          colors: {
            xaxisLabel: 'blue',
            yaxisLabel: 'blue',
          },
          fontSize: {
            xaxisLabel: 14,
            yaxisLabel: 14
          }
        },
        {
          name: 'point',
          id: 'cp',
          readonly: true,
          label: 'Point',
          color: 'sienna',
          size: 15
        },
        {
          name: 'horizontal-line',
          id: 'ha',
          label: 'Horizontal line',
          color: 'dimgray',
          dashStyle: 'dashdotted'
        },
        {
          name: 'vertical-line',
          id: 'va',
          label: 'Vertical line',
          color: 'dimgray',
          dashStyle: 'dashdotted'
        },
        {
          name: 'line-segment',
          id: 'ls',
          label: 'Segment',
          color: 'cornflowerblue',
          dashStyle: 'solid'
        },
        {
          name: 'line-segment',
          id: 'ar',
          readonly: true,
          label: 'Arrow',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          }
        },
        {
          name: 'line-segment',
          id: 'car',
          label: 'Constrained arrow',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          lengthConstraint: 100,
          arrowHead: {
            length: 10,
            base: 7
          },
        },
        {
          name: 'freeform',
          id: 'f',
          label: 'Function f(x)',
          color: 'orange'
        }
      ],
      initialstate: {
        'cp': [
          {
            'x': 100,
            'y': 100
          },
          {
            'x': 200,
            'y': 200
          },
          {
            'x': 300,
            'y': 300
          }
        ],
        'ar':  [
          {
            'x': 250,
            'y': 150
          },
          {
            'x': 350,
            'y': 250
          },
          {
            'x': 150,
            'y': 150
          },
          {
            'x': 120,
            'y': 120
          }
        ]
      }
    },
    axesParams: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'polar',
      plugins: [
        {
          name: 'axes',
          rrange: 2,
          rmajor: 0.5,
          thetamajor: 30,
          xaxisLabel: {
            value: 'x',
            dx: 5,
            dy: 5
          },
          yaxisLabel: {
            value: 'y',
            dx: 5,
            dy: 13
          },
          colors: {
            circle: 'red',
            ray: 'blue',
            xaxisLabel: 'blue',
            yaxisLabel: 'blue',
          },
          fontSize: {
            xaxisLabel: 14,
            yaxisLabel: 14
          },
          strokeWidth: {
            circle: 3,
            ray: 3
          }
        },
        {
          name: 'point',
          id: 'cp',
          label: 'Point',
          color: 'sienna',
          size: 15,
          hollow: true
        },
        {
          name: 'horizontal-line',
          id: 'ha',
          label: 'Horizontal line',
          color: 'dimgray',
          dashStyle: 'dashdotted'
        },
        {
          name: 'vertical-line',
          id: 'va',
          label: 'Vertical line',
          color: 'dimgray',
          dashStyle: 'dashdotted'
        },
        {
          name: 'line-segment',
          id: 'ls',
          label: 'Segment',
          color: 'cornflowerblue',
          dashStyle: 'solid'
        },
        {
          name: 'line-segment',
          id: 'ar',
          label: 'Arrow',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          }
        },
        {
          name: 'line-segment',
          id: 'car',
          label: 'Constrained arrow',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          lengthConstraint: 100,
          arrowHead: {
            length: 10,
            base: 7
          },
        },
        {
          name: 'freeform',
          id: 'f',
          label: 'Function f(x)',
          color: 'orange'
        }
      ]
    },
    newPlugins: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'cartesian',
      plugins: [
        {
          name: 'axes',
        },
        {
          name: 'stamp',
          id: 'st',
          label: 'Beam',
          imgwidth: 450,
          imgheight: 100,
          scale: 0.5
        },
        {
          name: 'polyline',
          id: 'pll',
          label: 'Polyline',
          color: 'cornflowerblue',
          dashStyle: 'solid'
        },
        {
          name: 'polyline',
          id: 'plg',
          label: 'Polygon',
          closed: true,
          color: 'mediumseagreen',
          fillColor: 'lightsteelblue',
          dashStyle: 'solid',
          opacity: 0.8
        },
        {
          name: 'spline',
          id: 'spl',
          label: 'Spline',
          color: 'orange',
        }
      ]
    },
    allPlugins: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'cartesian',
      plugins: [
        {
          name: 'axes'
        },
        {
          name: 'point',
          id: 'pt',
          label: 'Point',
          color: 'sienna',
          size: 15,
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        },
        {
          name: 'horizontal-line',
          id: 'hl',
          label: 'Horizontal line',
          color: 'dimgray',
          dashStyle: 'dashdotted',
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        },
        {
          name: 'vertical-line',
          id: 'vl',
          label: 'Vertical line',
          color: 'dimgray',
          dashStyle: 'dashdotted',
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: -15,
            align: 'start'
          }
        },
        {
          name: 'stamp',
          id: 'st',
          label: 'Stamp',
          color: 'cornflowerblue',
          imgwidth: 450,
          imgheight: 100,
          scale: 0.5,
          tag: {
            value : 'tag',
            xoffset: 0,
            yoffset: -35,
            align: 'middle'
          }
        },
        {
          name: 'line-segment',
          id: 'ar',
          label: 'Arrow',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          },
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'middle',
            position: 'end'
          }
        },
        {
          name: 'polyline',
          id: 'plg',
          label: 'Polygon',
          closed: true,
          color: 'mediumseagreen',
          fillColor: 'lightsteelblue',
          dashStyle: 'solid',
          opacity: 0.8,
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        },
        {
          name: 'spline',
          id: 'spl',
          label: 'Spline',
          color: 'royalblue',
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        },
        {
          name: 'freeform',
          id: 'f',
          label: 'Freeform',
          color: 'orange',
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        }
      ]
    },
    tagPosition: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'cartesian',
      plugins: [
        {
          name: 'axes'
        },
        {
          name: 'line-segment',
          id: 'startarrow',
          label: 'Start',
          color: 'sienna',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          },
          tag: {
            value : 'tag',
            xoffset: -10,
            yoffset: 4,
            align: 'end',
            position: 'start'
          }
        },
        {
          name: 'line-segment',
          id: 'middlearrow',
          label: 'Middle',
          color: 'cornflowerblue',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          },
          tag: {
            value : 'tag',
            xoffset: 0,
            yoffset: -15,
            align: 'middle',
            position: 'middle'
          }
        },
        {
          name: 'line-segment',
          id: 'endarrow',
          label: 'End',
          color: 'mediumseagreen',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          },
          tag: {
            value : 'tag',
            xoffset: 10,
            yoffset: 4,
            align: 'start',
            position: 'end'
          }
        }
      ]
    },
    latex: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      coordinates: 'cartesian',
      plugins: [
        {
          name: 'axes'
        },
        {
          name: 'point',
          id: 'pt',
          label: 'Point',
          color: 'sienna',
          size: 15,
          tag: {
            value : '\\displaystyle \\oint \\vec{F} \\cdot d\\vec{s}=0',
            xoffset: 15,
            yoffset: -50,
            align: 'start',
            latex: true
          }
        }
      ]
    },
  };
  if (configs.hasOwnProperty(configId)) {
    return configs[configId];
  }
  else {
    return null;
  }
}
