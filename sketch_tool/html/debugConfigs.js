function loadConfig(configId) {
  var configs = {
    config1: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      plugins: [
        {name: 'axes'},
        {name: 'freeform', id: 'f', label: 'Function f(x)', color: 'blue'},
        {name: 'freeform', id: 'g', label: 'Derivative g(x)', color: 'orange'},
        {name: 'vertical-line', id: 'va', label: 'Vertical asymptote', color: 'gray', dashStyle: 'dashdotted'},
        {name: 'horizontal-line', id: 'ha', label: 'Horizontal asymptote', color: 'gray', dashStyle: 'dashdotted'},
        {name: 'point', id: 'cp', label: 'Critical point', color: 'black', size: 15},
      ]
    },
    config2: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      plugins: [
        {name: 'axes'},
        {name: 'freeform', id: 'f', label: 'Function f(x)', color: 'blue'},
        {name: 'freeform', id: 'g', label: 'Derivative g(x)', color: 'orange'},
      ]
    },
    config3: {
      width: 750,
      height: 420,
      xrange: [-4.5, 4.5],
      yrange: [-2.5, 2.5],
      xscale: 'linear',
      yscale: 'linear',
      plugins: [
        {
          name: 'axes'
        },
        {
          name: 'point',
          id: 'cp',
          label: 'Point',
          color: 'dimgray',
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
          color: 'dimgray',
          dashStyle: 'solid'
        },
        {
          name: 'line-segment',
          id: 'vls',
          label: 'Vertical segment',
          color: 'dimgray',
          dashStyle: 'solid',
          directionConstraint: 'vertical'
        },
        {
          name: 'line-segment',
          id: 'ar',
          label: 'Arrow',
          color: 'dimgray',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          }
        },
        {
          name: 'line-segment',
          id: 'har',
          label: 'Horizontal arrow',
          color: 'dimgray',
          dashStyle: 'solid',
          arrowHead: {
            length: 10,
            base: 7
          },
          directionConstraint: 'horizontal'
        },
        {
          name: 'line-segment',
          id: 'cls',
          label: 'Constrained segment',
          color: 'dimgray',
          dashStyle: 'solid',
          lengthConstraint: 100,
          arrowHead: {
            length: 10,
            base: 7
          },
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
