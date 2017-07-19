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
      debug: true,
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
    allPluginsLatex: {
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
            latex: true,
            value : '\\displaystyle \\oint \\vec{F} \\cdot d\\vec{s}=0',
            xoffset: 5,
            yoffset: 5
          }
        },
        {
          name: 'horizontal-line',
          id: 'hl',
          label: 'Horizontal line',
          color: 'dimgray',
          dashStyle: 'dashdotted',
          tag: {
            latex: true,
            value : '\\displaystyle \\left.\\frac{x^3}{3}\\right|_0^1',
            xoffset: 20,
            yoffset: 5
          }
        },
        {
          name: 'vertical-line',
          id: 'vl',
          label: 'Vertical line',
          color: 'dimgray',
          dashStyle: 'dashdotted',
          tag: {
            latex: true,
            value : '\\displaystyle {n \\choose k}',
            xoffset: 5,
            yoffset: 5
          }
        },
        {
          name: 'stamp',
          id: 'st',
          label: 'Stamp',
          imgwidth: 450,
          imgheight: 100,
          scale: 0.5,
          tag: {
            latex: true,
            value : '\\displaystyle \\left(\\frac{x^2}{y^3}\\right)',
            xoffset: -20,
            yoffset: -75,
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
            latex: true,
            value : '\\displaystyle \\vec{x}',
            xoffset: 5,
            yoffset: 5,
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
            latex: true,
            value : '\\displaystyle \\frac{n!}{k!(n-k)!} = {^n}C_k',
            xoffset: 15,
            yoffset: 15
          }
        },
        {
          name: 'spline',
          id: 'spl',
          label: 'Spline',
          color: 'royalblue',
          tag: {
            latex: true,
            value : '\\displaystyle f(x) \\sim x^2 \\quad (x\\to\\infty)',
            xoffset: 15,
            yoffset: 15
          }
        },
        {
          name: 'freeform',
          id: 'f',
          label: 'Freeform',
          color: 'orange',
          tag: {
            latex: true,
            value : '\\displaystyle \\sqrt[n]{1+x+x^2+x^3+\\ldots}',
            xoffset: 15,
            yoffset: 15
          }
        }
      ]
    },
    invalidConfig: {
      debug: true,                    // Enables validation of config
      width: '750',                   // Incorrect type
      // height: 420,                 // Missing mandatory key
      xrange: [-4.5, '4.5', 3],       // Extra element and incorrect type
      yrange: [-2.5, 2.5],
      xscale: 'not linear',           // Only linear is valid
      yscale: 'linear',
      coordinates: 'spheric',         // Only cartesian or polar
      plugins: [
        {
          name: 'axes',
          xmajor: [3, 4],             // Wrong type
          // xminor: 2,               // Missing optional, won't report
          ymajor: 3,
          yminor: 2,
          wrongkey: 'wrong',          // Wrong key
          colors: {
            // Cartesian coordinates
            xmajor:     2,            // Wrong type
            ymajor:     '#f0f0f0',
            xminor:     '#f6f6f6',
            yminor:     '#f6f6f6',
            xaxis:      '#333',
            yaxis:      '#333',
            xlabels:     '#333',
            ylabels:     '#333',
            zeroLabel:  '#333',
            // Polar coordinates
            circle:     '#f0f0f0',
            ray:        '#f0f0f0',
            // Both
            xaxisLabel: '#333',
            yaxisLabel: '#333'
          }
        },
        {
          name: 'point',
          id: 'pt',
          label: 'Point',
          color: 'sienna',
          size: '15',       // Wrong type
          tag: {
            value : 'tag',
            xoffset: [15],  // Wrong type
            yoffset: 15,
            align: 'start'
          },
          wrongkey: 2       // Wrong key
        },
        {
          name: 'horizontal-line',
          id: 'hl',
          label: 'Horizontal line',
          color: 2,                   // wrong type
          dashStyle: 'wrong',         // wrong value
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'wrong',           // wrong value
            wrongkey: 2               // Wrong key
          },
          wrongkey: 2                 // Wrong key
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
            align: 'wrong',           // Wrong value
            wrongkey: 2               // Wrong key
          }
        },
        {
          name: 'stamp',
          id: 'st',
          label: 'Stamp',
          imgwidth: 450,
          imgheight: 100,
          scale: 'wrong',            // Wrong value
          tag: {
            value : 'tag',
            xoffset: 0,
            yoffset: -35,
            align: 'middle'
          },
          wrongkey: 2                 // Wrong key
        },
        {
          name: 'line-segment',
          id: 'ar',
          label: 'Arrow',
          color: 'mediumseagreen',
          dashStyle: 'wrong',        // Wrong value
          arrowHead: {
            length: '10',            // Wrong value
            base: 7,
            wrongkey: 2              // Wrong key
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
          fillColor: 1,             // Wrong value
          dashStyle: 'solid',
          opacity: 0.8,
          wrongkey: 2,              // Wrong key
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
          label: 1,                   // wrong value
          color: 'royalblue',
          wrongkey: 2 ,               // Wrong key
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
          label: 1,                   // Wrong value
          color: 'orange',
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          },
          wrongkey: 2                 // Wrong key
        }
      ]
    },
    pluginGroup: {
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
          name: 'freeform',
          id: 'f',
          label: 'Freeform',
          color:'cornflowerblue'
        },
        {
          name: 'group',
          id: 'lines',
          label: 'Lines',
          plugins: [
            {
              name: 'vertical-line',
              id: 'vl',
              color: 'dimgray'
            },
            {
              name: 'horizontal-line',
              id: 'hl',
              color: 'dimgray'
            },
            {
              name: 'line-segment',
              id: 'ls',
              label: 'Line segment',
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
            }
          ]
        },
        {
          name: 'group',
          id: 'points',
          label: 'Points',
          plugins: [
            {
              name: 'point',
              id: 'cp',
              label: 'Point',
              color: 'orange',
              size: 15
            },
            {
              name: 'point',
              id: 'ip',
              label: 'Hollow point',
              color: 'mediumseagreen',
              size: 15,
              hollow: true
            }
          ]
        },
        {
          name: 'spline',
          id: 'spl',
          label: 'Spline',
          color: 'mediumseagreen'
        }
      ]
    }
  };
  if (configs.hasOwnProperty(configId)) {
    return configs[configId];
  }
  else {
    return null;
  }
}
