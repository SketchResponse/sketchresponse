function loadConfig(configId) {
  var configs = {
    config1: {
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
    config2: {
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
          colors: {
            circle: 'red',
            ray: 'blue'
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
    config3: {
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
        }
      ]
    },
    config4: {
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
          id: 'cp',
          label: 'Point',
          color: 'sienna',
          size: 15,
          readonly: true,
          tag: {
            value : 'tag',
            xoffset: 15,
            yoffset: 15,
            align: 'start'
          }
        },
        {
          name: 'point',
          id: 'tp',
          label: 'Point',
          color: 'lightcoral',
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
          id: 'ha',
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
          id: 'va',
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
            'y': 100,
            'tag': 'pt1'
          },
          {
            'x': 200,
            'y': 100,
            'tag': 'pt2'
          },
          {
            'x': 300,
            'y': 100,
            'tag': 'pt3'
          }
        ]
      }
    }
  };
  if (configs.hasOwnProperty(configId)) {
    return configs[configId];
  }
  else {
    return null;
  }
}
