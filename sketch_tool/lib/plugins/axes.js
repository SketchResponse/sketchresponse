import z from 'sketch2/zdom';

export const VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

const DEFAULT_PARAMS = {
  xrange: [-5, 5],
  yrange: [-3, 3],
  xscale: 'linear',
  yscale: 'linear',
  xmajor: 1,
  ymajor: 1,
};

// TODO: add ability to set width/height/top/left for multiple axes

export default class Axes {
  constructor(params, app) {
    if (params.xscale !== 'linear' || params.yscale !== 'linear') {
      throw new Error('Only linear axis scales are supported in this release.');
    }

    this.params = params;

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.insertBefore(this.el, app.svg.firstChild);

    this.x = new LinearScale([0, app.width], params.xrange);
    this.y = new LinearScale([app.height, 0], params.yrange);

    this.xMajor = [-4, -3, -2, -1, 1, 2, 3, 4];
    this.yMajor = [-2, -1, 1, 2];

    this.xMinor = []
    this.yMinor = []

    let x = params.xrange[0];
    while (x <= params.xrange[1]) {
      this.xMinor.push(x);
      x += 0.25;
    }

    let y = params.yrange[0];
    while (y <= params.yrange[1]) {
      this.yMinor.push(y);
      y += 0.25;
    }

    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.xMinor, xval =>
        z('line.xminor', {
          x1: this.x.pixelVal(xval),
          x2: this.x.pixelVal(xval),
          y1: this.y.pixelMin,
          y2: this.y.pixelMax,
          style: 'stroke: #f6f6f6; stroke-width: 1px; shape-rendering: crispEdges;',
        })
      ),
      z.each(this.yMinor, yval =>
        z('line.yminor', {
          x1: this.x.pixelMin,
          x2: this.x.pixelMax,
          y1: this.y.pixelVal(yval),
          y2: this.y.pixelVal(yval),
          style: 'stroke: #f6f6f6; stroke-width: 1px; shape-rendering: crispEdges;',
        })
      ),
      z.each(this.xMajor, xval =>
        z('g',
          z('line.xmajor', {
            x1: this.x.pixelVal(xval),
            x2: this.x.pixelVal(xval),
            y1: this.y.pixelMin,
            y2: this.y.pixelMax,
            style: 'stroke: #f0f0f0; stroke-width: 2px; shape-rendering: crispEdges;',
          }),
          z('text.ticLabel', {
            'text-anchor': 'middle',
            x: this.x.pixelVal(xval) + 0,
            y: this.y.pixelVal(0) + 15,
            style: `fill: #333; font-size: 14px;`,
          }, String(xval))
        )
      ),
      z.each(this.yMajor, yval =>
        z('g',
          z('line.ymajor', {
            x1: this.x.pixelMin,
            x2: this.x.pixelMax,
            y1: this.y.pixelVal(yval),
            y2: this.y.pixelVal(yval),
            style: 'stroke: #f0f0f0; stroke-width: 2px; shape-rendering: crispEdges;',
          }),
          z('text.ticLabel', {
            'text-anchor': 'end',
            x: this.x.pixelVal(0) - 4,
            y: this.y.pixelVal(yval) + 5,
            style: `fill: #333; font-size: 14px;`,
          }, String(yval))
        )
      ),
      z('text.ticLabel', {
        'text-anchor': 'end',
        x: this.x.pixelVal(0) - 4,
        y: this.y.pixelVal(0) + 15,
        style: `fill: #333; font-size: 14px;`,
      }, String(0)),
      z('line.xaxis', {
        x1: this.x.pixelMin,
        x2: this.x.pixelMax,
        y1: this.y.pixelVal(0),
        y2: this.y.pixelVal(0),
        style: 'stroke: #333; stroke-width: 1px; shape-rendering: crispEdges;',
      }),
      z('line.yaxis', {
        x1: this.x.pixelVal(0),
        x2: this.x.pixelVal(0),
        y1: this.y.pixelMin,
        y2: this.y.pixelMax,
        style: 'stroke: #333; stroke-width: 1px; shape-rendering: crispEdges;',
      })
    );
  }
}

class LinearScale {
  constructor(pixelRange, mathRange) {
    this.pixelMin = pixelRange[0];
    this.pixelMax = pixelRange[1];
    this.pixelDelta = pixelRange[1] - pixelRange[0];
    this.mathMin = mathRange[0];
    this.mathMax = mathRange[1];
    this.mathDelta = mathRange[1] - mathRange[0];
  }

  mathVal(pixelVal) {
      return this.mathMin + (pixelVal - this.pixelMin) * (this.mathDelta / this.pixelDelta);
  }

  pixelVal(mathVal) {
      return this.pixelMin + (mathVal - this.mathMin) * (this.pixelDelta / this.mathDelta);
  }
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
