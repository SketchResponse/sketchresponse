import z from 'sketch2/util/zdom';
import deepExtend from 'deep-extend';

export const VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

const TWO_PI = 2 * Math.PI;
const ONE_EIGHTY_DIV_PI = 180 / Math.PI;
const PI_DIV_ONE_EIGHTY = Math.PI / 180;

const DEFAULT_PARAMS = {
  colors: {
    xmajor: '#f0f0f0',
    ymajor: '#f0f0f0',
    xminor: '#f6f6f6',
    yminor: '#f6f6f6',
    xaxis: '#333',
    yaxis: '#333',
    xaxisLabel: '#333',
    yaxisLabel: '#333',
    xlabel: '#333',
    ylabel: '#333',
    zeroLabel: '#333',
    circle: '#f0f0f0',
    ray: '#f0f0f0'
  },
  strokeWidth: {
    xmajor: 2,
    ymajor: 2,
    xminor: 1,
    yminor: 1,
    xaxis: 1,
    yaxis: 1,
    circle: 2,
    ray: 2
  },
  fontSize: {
    xlabel:    14,
    ylabel:    14,
    xaxisLabel: 14,
    yaxisLabel: 14,
    zeroLabel: 14
  }
};

const DEFAULTS = {
  targetXMajorTicks: 7,
  targetMinorMajorTickRatio: 4,
};

// TODO: add ability to set width/height/top/left for multiple axes

function generateUniformTicks(spacing, extent) {
  spacing = Math.abs(spacing);  // Being defensive

  const ticks = [];
  let currentTick = Math.ceil(extent[0] / spacing) * spacing;

  if (extent[0] < extent[1]) {
    while (currentTick <= extent[1]) {
      ticks.push(currentTick);
      currentTick += spacing;
    }
  }
  else {
    while (currentTick >= extent[1]) {
      ticks.push(currentTick);
      currentTick -= spacing;
    }
  }

  return ticks;
}


// Rounds a number to the geometrically-nearest value in the 1-2-5 series (preserving sign)
// Returns 0 if the input is 0.
// The general idea for this alorithm was taken from d3.js's linear scales
// TODO: is this close enough to require a license mention?
function nearestNiceNumber(number) {
  if (number === 0) return 0;

  const nextLowestPowerOf10 = Math.sign(number) * Math.pow(10, Math.floor(
    Math.log(Math.abs(number)) / Math.LN10
  ));

  const errorFactor = number / nextLowestPowerOf10;

  if (errorFactor < 1.414) return nextLowestPowerOf10;
  else if (errorFactor < 3.162) return 2 * nextLowestPowerOf10;
  else if (errorFactor < 7.071) return 5 * nextLowestPowerOf10;
  else return 10 * nextLowestPowerOf10;
}


export default class Axes {
  constructor(params, app) {
    if (params.xscale !== 'linear' || params.yscale !== 'linear') {
      throw new Error('Only linear axis scales are supported in this release.');
    }

    this.params = DEFAULT_PARAMS;
    deepExtend(this.params, params);

    this.coordinates = (params.coordinates === undefined) ? 'cartesian' : params.coordinates;

    if (this.coordinates !== 'cartesian' && this.coordinates !== 'polar') {
      throw new Error('Only cartesian or polar axes are supported.');
    }

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.appendChild(this.el);

    this.x = new LinearScale([0, params.width], params.xrange);
    this.y = new LinearScale([params.height, 0], params.yrange);

    if (this.coordinates === 'cartesian') {
      this.initCartesian(params);
    }
    else {
      this.initPolar(params);
    }

    this.render();
  }

  initCartesian(params) {
    this.zeroLabel = params.zerolabel;

    const approxMajorPixelSpacing = params.width / DEFAULTS.targetXMajorTicks;

    const defaultMajorXSpacing = nearestNiceNumber(Math.abs(
      this.x.mathDelta / this.x.pixelDelta * approxMajorPixelSpacing));

    let defaultMinorXSpacing = nearestNiceNumber(
      defaultMajorXSpacing / DEFAULTS.targetMinorMajorTickRatio);

    const defaultMajorYSpacing = nearestNiceNumber(Math.abs(
      this.y.mathDelta / this.y.pixelDelta * approxMajorPixelSpacing));

    let defaultMinorYSpacing = nearestNiceNumber(
      defaultMajorYSpacing / DEFAULTS.targetMinorMajorTickRatio);


    // Note: can't use `||` since 0 and null are falsy
    this.xMajor = (params.xmajor !== undefined) ? params.xmajor
      : (params.major !== undefined) ? params.major
      : defaultMajorXSpacing;

    if (this.xMajor === null) this.xMajor = [];
    else if (this.xMajor === 0) this.xMajor = [0];  // Avoids an infinite loop with spacing = 0
    else if (typeof this.xMajor === 'number') {
      // xMajor is a tick spacing
      defaultMinorXSpacing = nearestNiceNumber(this.xMajor / DEFAULTS.targetMinorMajorTickRatio);
      this.xMajor = generateUniformTicks(this.xMajor, params.xrange);
    }
    else {
      // Custom tick array; disable default minor ticks in this case
      defaultMinorXSpacing = null;
    }


    this.xLabels = (params.xlabels !== undefined) ? params.xlabels
      : (params.labels !== undefined) ? params.labels
      : this.xMajor;

    if (this.xLabels === null) this.xLabels = this.xMajor.map(() => '');

    if (this.zeroLabel === undefined) {
      this.zeroLabel = this.xLabels[this.xMajor.indexOf(0)];
    }

    this.xLabels = this.xLabels.filter((_, idx) => this.xMajor[idx] !== 0);
    this.xMajor = this.xMajor.filter(val => val !== 0);


    // Note: can't use `||` since 0 and null are falsy
    this.yMajor = (params.ymajor !== undefined) ? params.ymajor
      : (params.major !== undefined) ? params.major
      : defaultMajorYSpacing;

    if (this.yMajor === null) this.yMajor = [];
    else if (this.yMajor === 0) this.yMajor = [0];  // Avoids an infinite loop with spacing = 0
    else if (typeof this.yMajor === 'number') {
      // yMajor is a tick spacing
      defaultMinorYSpacing = nearestNiceNumber(this.yMajor / DEFAULTS.targetMinorMajorTickRatio);
      this.yMajor = generateUniformTicks(this.yMajor, params.yrange);
    }
    else {
      // Custom tick array; disable default minor ticks in this case
      defaultMinorYSpacing = null;
    }


    this.yLabels = (params.ylabels !== undefined) ? params.ylabels
      : (params.labels !== undefined) ? params.labels
      : this.yMajor;

    if (this.yLabels === null) this.yLabels = this.yMajor.map(() => '');

    if (this.zeroLabel === undefined) {
      this.zeroLabel = this.yLabels[this.yMajor.indexOf(0)];
    }

    this.yLabels = this.yLabels.filter((_, idx) => this.yMajor[idx] !== 0);
    this.yMajor = this.yMajor.filter(val => val !== 0);


    // Note: can't use `||` since 0 and null are falsy
    this.xMinor = (params.xminor !== undefined) ? params.xminor
      : (params.minor !== undefined) ? params.minor
      : defaultMinorXSpacing;

    if (this.xMinor === null) this.xMinor = [];
    else if (this.xMinor === 0) this.xMinor = [0];  // Avoids an infinite loop with spacing = 0
    else if (typeof this.xMinor === 'number') {
      // xMinor is a tick spacing
      this.xMinor = generateUniformTicks(this.xMinor, params.xrange);
    }

    this.xMinor = this.xMinor.filter(val => !(this.xMajor.indexOf(val) >= 0));  // Exclude values in xMajor


    // Note: can't use `||` since 0 and null are falsy
    this.yMinor = (params.yminor !== undefined) ? params.yminor
      : (params.minor !== undefined) ? params.minor
      : defaultMinorYSpacing;

    if (this.yMinor === null) this.yMinor = [];
    else if (this.yMinor === 0) this.yMinor = [0];  // Avoids an infinite loop with spacing = 0
    else if (typeof this.yMinor === 'number') {
      // yMinor is a tick spacing
      this.yMinor = generateUniformTicks(this.yMinor, params.yrange);
    }

    this.yMinor = this.yMinor.filter(val => !(this.yMajor.indexOf(val) >= 0));  // Exclude values in xMajor
  }

  initPolar(params) {
    this.rRange = (params.rrange !== undefined) ? params.rrange : 10;
    this.rMajor = (params.rmajor !== undefined) ? params.rmajor : 1;
    this.thetaMajor = (params.thetamajor !== undefined) ? params.thetamajor : 30;
    this.thetaMajor = degToRad(this.thetaMajor);
    this.circles = this.generateCircles(this.rMajor, this.rRange);
    this.rays = this.generateRays(this.thetaMajor);
  }

  generateCirclePoints(r) {
    let ang, x, y, i, ret = [];

    for (ang = 0; ang <= 360; ang++) {
      x = r * Math.cos(degToRad(ang));
      y = r * Math.sin(degToRad(ang));
      ret.push({
        x: this.x.pixelVal(x),
        y: this.y.pixelVal(y)
      });
    }

    return ret;
  }

  generateCircles(rSpacing, rMax) {
    rSpacing = Math.abs(rSpacing);  // Being defensive

    let circles = [], r = 0;

    while (r < rMax) {
      r += rSpacing;
      circles.push(this.generateCirclePoints(r));
    }

    return circles;
  }

  generateRays(angleSpacing) {
    angleSpacing = Math.abs(angleSpacing);  // Being defensive

    let rays = [], angle = 0, radius = this.rRange + 0.25;

    while (angle < TWO_PI) {
      angle += angleSpacing;
      rays.push({
        x1: this.x.pixelVal(0),
        y1: this.y.pixelVal(0),
        x2: this.x.pixelVal(radius*Math.cos(angle)),
        y2: this.y.pixelVal(radius*Math.sin(angle))
      });
    }

    return rays;
  }

  render() {
    if (this.coordinates === 'cartesian') {
      z.render(this.el,
        z.each(this.xMinor, xval =>
          z('line.xminor', {
            x1: this.x.pixelVal(xval),
            x2: this.x.pixelVal(xval),
            y1: this.y.pixelMin,
            y2: this.y.pixelMax,
            style: `
              stroke: ${this.params.colors.xminor};
              stroke-width: ${this.params.strokeWidth.xminor}px;
              shape-rendering: crispEdges;
            `,
          })
        ),
        z.each(this.yMinor, yval =>
          z('line.yminor', {
            x1: this.x.pixelMin,
            x2: this.x.pixelMax,
            y1: this.y.pixelVal(yval),
            y2: this.y.pixelVal(yval),
            style: `
              stroke: ${this.params.colors.yminor};
              stroke-width: ${this.params.strokeWidth.yminor}px;
              shape-rendering: crispEdges;
            `,
          })
        ),
        z.each(this.xMajor, (xval, idx) =>
          z('g',
            z('line.xmajor', {
              x1: this.x.pixelVal(xval),
              x2: this.x.pixelVal(xval),
              y1: this.y.pixelMin,
              y2: this.y.pixelMax,
              style: `
                stroke: ${this.params.colors.xmajor};
                stroke-width: ${this.params.strokeWidth.xmajor}px;
                shape-rendering: crispEdges;
              `,
            }),
            z('text.default-text', {
              'text-anchor': 'middle',
              x: this.x.pixelVal(xval) + 0,
              y: this.y.pixelVal(0) + 15,
              style: `
                fill: ${this.params.colors.xlabel};
                font-size: ${this.params.fontSize.xlabel}px;
              `,
            }, String(this.xLabels[idx]))
          )
        ),
        z.each(this.yMajor, (yval, idx) =>
          z('g',
            z('line.ymajor', {
              x1: this.x.pixelMin,
              x2: this.x.pixelMax,
              y1: this.y.pixelVal(yval),
              y2: this.y.pixelVal(yval),
              style: `
                stroke: ${this.params.colors.ymajor};
                stroke-width: ${this.params.strokeWidth.ymajor}px;
                shape-rendering: crispEdges;
              `,
            }),
            z('text.default-text', {
              'text-anchor': 'end',
              x: this.x.pixelVal(0) - 4,
              y: this.y.pixelVal(yval) + 5,
              style: `
                fill: ${this.params.colors.ylabel};
                font-size: ${this.params.fontSize.ylabel}px;
              `,
            }, String(this.yLabels[idx]))
          )
        ),
        z.if(this.zeroLabel !== undefined && this.zeroLabel !== null, () =>
          z('text.default-text', {
            'text-anchor': 'end',
            x: this.x.pixelVal(0) - 4,
            y: this.y.pixelVal(0) + 15,
            style: `
              fill: ${this.params.colors.zeroLabel};
              font-size: ${this.params.fontSize.zeroLabel}px;
            `,
          }, String(this.zeroLabel))
        ),
        z('line.xaxis', {
          x1: this.x.pixelMin,
          x2: this.x.pixelMax,
          y1: this.y.pixelVal(0),
          y2: this.y.pixelVal(0),
          style: `
            stroke: ${this.params.colors.xaxis};
            stroke-width: ${this.params.strokeWidth.xaxis}px;
            shape-rendering: crispEdges;
          `,
        }),
        z('line.yaxis', {
          x1: this.x.pixelVal(0),
          x2: this.x.pixelVal(0),
          y1: this.y.pixelMin,
          y2: this.y.pixelMax,
          style: `
            stroke: ${this.params.colors.yaxis};
            stroke-width: ${this.params.strokeWidth.yaxis}px;
            shape-rendering: crispEdges;
          `,
        }),
        z.if(this.params.xaxisLabel, () =>
          z('text.default-text', {
            'text-anchor': 'end',
            x: this.x.pixelMax - this.params.xaxisLabel.dx,
            y: this.y.pixelVal(0) - this.params.xaxisLabel.dy,
            style: `
              fill: ${this.params.colors.xaxisLabel};
              font-size: ${this.params.fontSize.xaxisLabel}px;
            `,
          }, this.params.xaxisLabel.value)
        ),
        z.if(this.params.yaxisLabel, () =>
          z('text.default-text', {
            'text-anchor': 'start',
            x: this.x.pixelVal(0) + this.params.yaxisLabel.dx,
            y: this.y.pixelMax + this.params.yaxisLabel.dy,
            style: `
              fill: ${this.params.colors.yaxisLabel};
              font-size: ${this.params.fontSize.yaxisLabel}px;
            `,
          }, this.params.yaxisLabel.value)
        )
      );
    }
    else {
      z.render(this.el,
        z.each(this.circles, circle =>
          z('polyline', {
            points: polylineData(circle),
            style: `
              stroke: ${this.params.colors.circle};
              stroke-width: ${this.params.strokeWidth.circle}px;
              fill: none;
              shape-rendering: geometricPrecision;
            `,
          })
        ),
        z.each(this.rays, ray =>
          z('line', {
            x1: ray.x1,
            y1: ray.y1,
            x2: ray.x2,
            y2: ray.y2,
            style: `
              stroke: ${this.params.colors.ray};
              stroke-width: ${this.params.strokeWidth.ray}px;
              fill: none;
              shape-rendering: geometricPrecision;
            `,
          })
        ),
        z('line.xaxis', {
          x1: this.x.pixelMin,
          x2: this.x.pixelMax,
          y1: this.y.pixelVal(0),
          y2: this.y.pixelVal(0),
          style: `
            stroke: ${this.params.colors.xaxis};
            stroke-width: ${this.params.strokeWidth.xaxis}px;
            shape-rendering: geometricPrecision;
          `,
        }),
        z('line.yaxis', {
          x1: this.x.pixelVal(0),
          x2: this.x.pixelVal(0),
          y1: this.y.pixelMin,
          y2: this.y.pixelMax,
          style: `
            stroke: ${this.params.colors.xaxis};
            stroke-width: ${this.params.strokeWidth.xaxis}px;
            shape-rendering: geometricPrecision;
          `,
        }),
        z.if(this.params.xaxisLabel, () =>
          z('text.default-text', {
            'text-anchor': 'end',
            x: this.x.pixelMax - this.params.xaxisLabel.dx,
            y: this.y.pixelVal(0) - this.params.xaxisLabel.dy,
            style: `
              fill: ${this.params.colors.xaxisLabel};
              font-size: ${this.params.fontSize.xaxisLabel}px;
            `,
          }, this.params.xaxisLabel.value)
        ),
        z.if(this.params.yaxisLabel, () =>
          z('text.default-text', {
            'text-anchor': 'start',
            x: this.x.pixelVal(0) + this.params.yaxisLabel.dx,
            y: this.y.pixelMax + this.params.yaxisLabel.dy,
            style: `
              fill: ${this.params.colors.yaxisLabel};
              font-size: ${this.params.fontSize.yaxisLabel}px;
            `,
          }, this.params.yaxisLabel.value)
        )
      );
    }
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

function polylineData(points) {
  if (points.length < 2) return '';
  const coords = points.map(p => `${p.x},${p.y}`);
  return coords.join(' ');
}

function degToRad(angle) {
  return PI_DIV_ONE_EIGHTY * angle;
}

function radToDeg(angle) {
  return ONE_EIGHTY_DIV_PI * angle;
}
