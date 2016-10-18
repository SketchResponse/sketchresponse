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
          name: 'axes',
        },
        {
          name: 'point',
          id: 'cp',
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
          thetamajor: 30
        },
        {
          name: 'point',
          id: 'cp',
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
    }
  };
  if (configs.hasOwnProperty(configId)) {
    return configs[configId];
  }
  else {
    return null;
  }
}
