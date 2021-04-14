/* eslint-disable max-classes-per-file */
/* eslint-disable key-spacing */
import deepExtend from 'deep-extend';
import z from '../util/zdom';
import validate from '../config-validator';

export const VERSION = '0.1';

const TWO_PI = 2 * Math.PI;
const PI_DIV_ONE_EIGHTY = Math.PI / 180;

const DEFAULT_PARAMS = {
  // The default of these is calculated
  // xmajor, xminor, xlabels
  // ymajor, yminor, ylabels
  // major,  minor,  labels
  rrange:     10,
  rmajor:     1,
  thetamajor: 30,
  colors: {
    // Cartesian coordinates
    xmajor:     '#d8d8d8',
    ymajor:     '#d8d8d8',
    xminor:     '#dddddd',
    yminor:     '#dddddd',
    xaxis:      '#333',
    yaxis:      '#333',
    xlabels:    '#333',
    ylabels:    '#333',
    zeroLabel:  '#333',
    // Polar coordinates
    circle:     '#d8d8d8',
    ray:        '#d8d8d8',
    // Both
    xaxisLabel: '#333',
    yaxisLabel: '#333',
  },
  fontSize: {
    // Cartesian coordinates
    xlabels:     14,
    ylabels:     14,
    zeroLabel:   14,
    // Both
    xaxisLabel:  14,
    yaxisLabel:  14,
  },
  strokeWidth: {
    // Cartesian coordinates
    xmajor: 2,
    ymajor: 2,
    xminor: 1,
    yminor: 1,
    xaxis:  1,
    yaxis:  1,
    // Polar coordinates
    circle: 2,
    ray:    2,
  },
};

const DEFAULTS = {
  targetXMajorTicks: 7,
  targetMinorMajorTickRatio: 4,
};

// TODO: add ability to set width/height/top/left for multiple axes

function generateUniformTicks(spacingParam, extent) {
  const spacing = Math.abs(spacingParam); // Being defensive
  const ticks = [];
  let currentTick = Math.ceil(extent[0] / spacing) * spacing;

  if (extent[0] < extent[1]) {
    while (currentTick <= extent[1]) {
      ticks.push(currentTick);
      currentTick += spacing;
    }
  } else {
    while (currentTick >= extent[1]) {
      ticks.push(currentTick);
      currentTick -= spacing;
    }
  }

  return ticks;
}

// Rounds a number to the geometrically-nearest value in the 1-2-5 series (preserving sign)
// Returns 0 if the input is 0.
// The general idea for this algorithm was taken from d3.js's linear scales
// TODO: is this close enough to require a license mention?
function nearestNiceNumber(number) {
  if (number === 0) return 0;

  const nextLowestPowerOf10 =
    Math.sign(number) * 10 ** Math.floor(Math.log(Math.abs(number)) / Math.LN10);

  const errorFactor = number / nextLowestPowerOf10;

  if (errorFactor < 1.414) return nextLowestPowerOf10;
  if (errorFactor < 3.162) return 2 * nextLowestPowerOf10;
  if (errorFactor < 7.071) return 5 * nextLowestPowerOf10;
  return 10 * nextLowestPowerOf10;
}

function polylineData(points) {
  if (points.length < 2) return '';
  const coords = points.map((p) => `${p.x},${p.y}`);
  return coords.join(' ');
}

function degToRad(angle) {
  return PI_DIV_ONE_EIGHTY * angle;
}

class LinearScale {
  constructor(pixelRange, mathRange) {
    [this.pixelMin, this.pixelMax] = pixelRange;
    [this.mathMin, this.mathMax] = mathRange;
    this.pixelDelta = pixelRange[1] - pixelRange[0];
    this.mathDelta = mathRange[1] - mathRange[0];
  }

  mathVal(pixelVal) {
      return this.mathMin + (pixelVal - this.pixelMin) * (this.mathDelta / this.pixelDelta);
  }

  pixelVal(mathVal) {
      return this.pixelMin + (mathVal - this.mathMin) * (this.pixelDelta / this.mathDelta);
  }
}

export default class Axes {
  constructor(params, app) {
    this.generateDefaultParams(params);
    if (!app.debug || validate(params, 'axes')) {
      deepExtend(this.params, params);
    } else {
      // eslint-disable-next-line no-console
      console.log('The axes config has errors, using default values instead');
    }

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.appendChild(this.el);

    this.x = new LinearScale([0, this.params.width], this.params.xrange);
    this.y = new LinearScale([this.params.height, 0], this.params.yrange);

    if (this.params.coordinates === 'cartesian') {
      this.initCartesian();
    } else {
      this.initPolar();
    }

    this.render();
  }

  generateDefaultParams(params) {
    this.params = DEFAULT_PARAMS;
    const keys = ['name', 'width', 'height', 'xrange', 'yrange', 'xscale', 'yscale', 'coordinates'];
    // eslint-disable-next-line no-restricted-syntax
    for (const key of keys) {
      this.params[key] = params[key];
    }
  }

  initCartesian() {
    const approxMajorPixelSpacing = this.params.width / DEFAULTS.targetXMajorTicks;

    const defaultMajorXSpacing = nearestNiceNumber(Math.abs(
      this.x.mathDelta / this.x.pixelDelta * approxMajorPixelSpacing));

    let defaultMinorXSpacing = nearestNiceNumber(
      defaultMajorXSpacing / DEFAULTS.targetMinorMajorTickRatio);

    const defaultMajorYSpacing = nearestNiceNumber(Math.abs(
      this.y.mathDelta / this.y.pixelDelta * approxMajorPixelSpacing));

    let defaultMinorYSpacing = nearestNiceNumber(
      defaultMajorYSpacing / DEFAULTS.targetMinorMajorTickRatio);

    // Note: can't use `||` since 0 and null are falsy
    this.xMajor = (this.params.xmajor !== undefined) ? this.params.xmajor
      : (this.params.major !== undefined) ? this.params.major
      : defaultMajorXSpacing;

    if (this.xMajor === null) this.xMajor = [];
    else if (this.xMajor === 0) this.xMajor = [0]; // Avoids an infinite loop with spacing = 0
    else if (typeof this.xMajor === 'number') {
      // xMajor is a tick spacing
      defaultMinorXSpacing = nearestNiceNumber(this.xMajor / DEFAULTS.targetMinorMajorTickRatio);
      this.xMajor = generateUniformTicks(this.xMajor, this.params.xrange);
    } else {
      // Custom tick array; disable default minor ticks in this case
      defaultMinorXSpacing = null;
    }

    this.xLabels = (this.params.xlabels !== undefined) ? this.params.xlabels
      : (this.params.labels !== undefined) ? this.params.labels
      : this.xMajor;

    if (this.xLabels === null) this.xLabels = this.xMajor.map(() => '');

    if (this.params.zerolabel === undefined) {
      this.params.zerolabel = this.xLabels[this.xMajor.indexOf(0)];
    }

    this.xLabels = this.xLabels.filter((_, idx) => this.xMajor[idx] !== 0);
    this.xMajor = this.xMajor.filter((val) => val !== 0);

    // Note: can't use `||` since 0 and null are falsy
    this.yMajor = (this.params.ymajor !== undefined) ? this.params.ymajor
      : (this.params.major !== undefined) ? this.params.major
      : defaultMajorYSpacing;

    if (this.yMajor === null) this.yMajor = [];
    else if (this.yMajor === 0) this.yMajor = [0]; // Avoids an infinite loop with spacing = 0
    else if (typeof this.yMajor === 'number') {
      // yMajor is a tick spacing
      defaultMinorYSpacing = nearestNiceNumber(this.yMajor / DEFAULTS.targetMinorMajorTickRatio);
      this.yMajor = generateUniformTicks(this.yMajor, this.params.yrange);
    } else {
      // Custom tick array; disable default minor ticks in this case
      defaultMinorYSpacing = null;
    }

    this.yLabels = (this.params.ylabels !== undefined) ? this.params.ylabels
      : (this.params.labels !== undefined) ? this.params.labels
      : this.yMajor;

    if (this.yLabels === null) this.yLabels = this.yMajor.map(() => '');

    if (this.params.zerolabel === undefined) {
      this.params.zerolabel = this.yLabels[this.yMajor.indexOf(0)];
    }

    this.yLabels = this.yLabels.filter((_, idx) => this.yMajor[idx] !== 0);
    this.yMajor = this.yMajor.filter((val) => val !== 0);

    // Note: can't use `||` since 0 and null are falsy
    this.xMinor = (this.params.xminor !== undefined) ? this.params.xminor
      : (this.params.minor !== undefined) ? this.params.minor
      : defaultMinorXSpacing;

    if (this.xMinor === null) this.xMinor = [];
    else if (this.xMinor === 0) this.xMinor = [0]; // Avoids an infinite loop with spacing = 0
    else if (typeof this.xMinor === 'number') {
      // xMinor is a tick spacing
      this.xMinor = generateUniformTicks(this.xMinor, this.params.xrange);
    }
     // Exclude values in xMajor
    this.xMinor = this.xMinor.filter((val) => !(this.xMajor.indexOf(val) >= 0));

    // Note: can't use `||` since 0 and null are falsy
    this.yMinor = (this.params.yminor !== undefined) ? this.params.yminor
      : (this.params.minor !== undefined) ? this.params.minor
      : defaultMinorYSpacing;

    if (this.yMinor === null) this.yMinor = [];
    else if (this.yMinor === 0) this.yMinor = [0]; // Avoids an infinite loop with spacing = 0
    else if (typeof this.yMinor === 'number') {
      // yMinor is a tick spacing
      this.yMinor = generateUniformTicks(this.yMinor, this.params.yrange);
    }
     // Exclude values in xMajor
    this.yMinor = this.yMinor.filter((val) => !(this.yMajor.indexOf(val) >= 0));
  }

  initPolar() {
    this.rRange = (this.params.rrange !== undefined) ? this.params.rrange : 10;
    this.rMajor = (this.params.rmajor !== undefined) ? this.params.rmajor : 1;
    this.thetaMajor = (this.params.thetamajor !== undefined) ? this.params.thetamajor : 30;
    this.thetaMajor = degToRad(this.thetaMajor);
    this.circles = this.generateCircles(this.rMajor, this.rRange);
    this.rays = this.generateRays(this.thetaMajor);
  }

  generateCirclePoints(r) {
    const ret = [];
    let ang;
    let x;
    let y;

    for (ang = 0; ang <= 360; ang++) {
      x = r * Math.cos(degToRad(ang));
      y = r * Math.sin(degToRad(ang));
      ret.push({
        x: this.x.pixelVal(x),
        y: this.y.pixelVal(y),
      });
    }

    return ret;
  }

  generateCircles(rSpacingParam, rMax) {
    const rSpacing = Math.abs(rSpacingParam); // Being defensive
    const circles = [];
    let r = 0;

    while (r < rMax) {
      r += rSpacing;
      circles.push(this.generateCirclePoints(r));
    }

    return circles;
  }

  generateRays(angleSpacingParam) {
    const angleSpacing = Math.abs(angleSpacingParam); // Being defensive
    const rays = [];
    const radius = this.rRange + 0.25;
    let angle = 0;

    while (angle < TWO_PI) {
      angle += angleSpacing;
      rays.push({
        x1: this.x.pixelVal(0),
        y1: this.y.pixelVal(0),
        x2: this.x.pixelVal(radius * Math.cos(angle)),
        y2: this.y.pixelVal(radius * Math.sin(angle)),
      });
    }

    return rays;
  }

  render() {
    if (this.params.coordinates === 'cartesian') {
      z.render(this.el,
        z.each(this.xMinor, (xval) =>
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
          }),
        ),
        z.each(this.yMinor, (yval) =>
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
          }),
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
                fill: ${this.params.colors.xlabels};
                font-size: ${this.params.fontSize.xlabels}px;
              `,
            }, String(this.xLabels[idx])),
          ),
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
                fill: ${this.params.colors.ylabels};
                font-size: ${this.params.fontSize.ylabels}px;
              `,
            }, String(this.yLabels[idx])),
          ),
        ),
        z.if(this.params.zerolabel !== undefined && this.params.zerolabel !== null, () =>
          z('text.default-text', {
            'text-anchor': 'end',
            x: this.x.pixelVal(0) - 4,
            y: this.y.pixelVal(0) + 15,
            style: `
              fill: ${this.params.colors.zeroLabel};
              font-size: ${this.params.fontSize.zeroLabel}px;
            `,
          }, String(this.params.zerolabel)),
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
          }, this.params.xaxisLabel.value),
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
          }, this.params.yaxisLabel.value),
        ),
      );
    } else {
      z.render(this.el,
        z.each(this.circles, (circle) =>
          z('polyline', {
            points: polylineData(circle),
            style: `
              stroke: ${this.params.colors.circle};
              stroke-width: ${this.params.strokeWidth.circle}px;
              fill: none;
              shape-rendering: geometricPrecision;
            `,
          }),
        ),
        z.each(this.rays, (ray) =>
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
          }),
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
          }, this.params.xaxisLabel.value),
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
          }, this.params.yaxisLabel.value),
        ),
      );
    }
  }
}
