import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';
import fitCurve from './freeform/fitcurve';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const FIT_TOLERANCE = 5;
const RUBBER_BAND_LENGTH = 25;
const MIN_POINT_SPACING = 3;
const MAX_POINT_SPACING = 3;
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

export default class Freeform extends BasePlugin {

  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/freeform/freeform-icon.svg',
      alt: 'Freeform tool',
      color: params.color
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addFreeform', (id, index) => {this.addFreeform(id, index)});
    this.app.__messageBus.on('deleteFreeforms', (id, index) => {this.deleteFreeforms(id, index)});

    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
    this.firstPoint = true;
    this.pointsBeingDrawn = [];
  }

  getGradeable() {
    return this.state.map(spline => {
      return {
        spline: spline.map(point => [point.x, point.y]),
        tag: spline[0].tag
      };
    });
  }

  addFreeform(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteFreeforms() {
    if (this.delIndices.length !== 0) {
      this.delIndices.sort();
      for (let i = this.delIndices.length -1; i >= 0; i--) {
        this.state.splice(this.delIndices[i], 1);
      }
      this.delIndices.length = 0;
      this.render();
    }
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the freeform shape
  initDraw(event) {
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.firstPoint = (this.state.length % 2 === 0);
    this.lastPoint = this.pointerPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    this.pointsBeingDrawn.push(this.lastPoint);
    event.stopPropagation();
    event.preventDefault();
  }

  drawMove(event) {
    this.pointerPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top
    };

    let pointerDistance = Math.sqrt(
      Math.pow(this.pointerPosition.x - this.lastPoint.x, 2) +
      Math.pow(this.pointerPosition.y - this.lastPoint.y, 2)
    );

    let drawDirection;

    while (pointerDistance >= MIN_POINT_SPACING + RUBBER_BAND_LENGTH) {
      // Only compute drawDirection once per drawMove call since it won't change until the next drawMove
      drawDirection = drawDirection || direction(substract(this.pointerPosition, this.lastPoint));

      const drawDistance = clamp(
        pointerDistance - RUBBER_BAND_LENGTH,
        MIN_POINT_SPACING,
        MAX_POINT_SPACING
      );

      const nextPoint = add(this.lastPoint, scale(drawDirection, drawDistance));

      // For now, finish the draw operation if the next point would be outside of the drawing area
      // TODO: is this actually how we want to do things?
      if (nextPoint.x < 0 || nextPoint.y < 0
        || nextPoint.x > this.params.width || nextPoint.y > this.params.height) {

        this.drawEnd(event);  // Just pass our pointermove event instead of a true pointerup
        return;
      }

      this.pointsBeingDrawn.push(nextPoint);
      this.lastPoint = nextPoint;
      pointerDistance -= drawDistance;
    }

    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  drawEnd(event) {
    document.removeEventListener('pointermove', this.drawMove, true);
    document.removeEventListener('pointerup', this.drawEnd, true);
    document.removeEventListener('pointercancel', this.drawEnd, true);
    this.lastPoint = null;
    this.pointerPosition = null;

    if (this.pointsBeingDrawn.length >= 2) {
      const splineData = fitCurve(this.pointsBeingDrawn, FIT_TOLERANCE);
      splineData.forEach(point => {
        point.x = Math.round(ROUNDING_PRESCALER * point.x) / ROUNDING_PRESCALER;
        point.y = Math.round(ROUNDING_PRESCALER * point.y) / ROUNDING_PRESCALER;
      });
      if (this.hasTag) {
        splineData[0].tag = this.tag.value;
      }
      this.state.push(splineData);
      this.app.addUndoPoint();
    }
    this.pointsBeingDrawn = [];
    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    z.render(this.el,
      z.each(this.state, (spline, splineIndex) =>
        // Draw visible spline under invisible spline
        z('path.visible-' + splineIndex + '.freeform' + '.plugin-id-' + this.id, {
          d: cubicSplinePathData(spline),
          style: `stroke: ${this.params.color}; stroke-width: 3px; fill: none;`,
        })
      ),
      // Draw invisible, selectable spline
      z.each(this.state, (spline, splineIndex) =>
        z('path.invisible-' + splineIndex + this.readOnlyClass(), {
          d: cubicSplinePathData(spline),
          style: `stroke: ${this.params.color}; stroke-width: 10px; fill: none; opacity: 0;`,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                this.state[splineIndex].forEach((pt) => {
                  pt.x += dx;
                  pt.y += dy;
                });
                this.render();
              },
              inBoundsX: (dx) => {
                for (let i = 0, len = this.state[splineIndex].length; i < len - 3; i += 3) {
                  let boundingBox = getBoundingBox(
                    this.state[splineIndex][i].x + dx, this.state[splineIndex][i].y,
                    this.state[splineIndex][i+1].x + dx, this.state[splineIndex][i+1].y,
                    this.state[splineIndex][i+2].x + dx, this.state[splineIndex][i+2].y,
                    this.state[splineIndex][i+3].x + dx, this.state[splineIndex][i+3].y
                  );
                  if (!(this.inBoundsX(boundingBox.min.x) &&
                      this.inBoundsX(boundingBox.max.x))) {
                    return false;
                  }
                }
                return true;
              },
              inBoundsY: (dy) => {
                for (let i = 0, len = this.state[splineIndex].length; i < len - 3; i += 3) {
                  let boundingBox = getBoundingBox(
                    this.state[splineIndex][i].x, this.state[splineIndex][i].y + dy,
                    this.state[splineIndex][i+1].x, this.state[splineIndex][i+1].y + dy,
                    this.state[splineIndex][i+2].x, this.state[splineIndex][i+2].y + dy,
                    this.state[splineIndex][i+3].x, this.state[splineIndex][i+3].y + dy
                  );
                  if (!(this.inBoundsY(boundingBox.min.y) &&
                      this.inBoundsY(boundingBox.max.y))) {
                    return false;
                  }
                }
                return true;
              },
            });
          }
        })
      ),
      z('path', {
        d: polylinePathData(this.pointsBeingDrawn),
        style: `stroke: ${this.params.color}; stroke-width: 3px; fill: none; opacity: 0.7;`,
      }),
      z.if(this.lastPoint && this.pointerPosition, () =>
        z('line', {
          x1: this.lastPoint.x,
          y1: this.lastPoint.y,
          x2: this.pointerPosition.x,
          y2: this.pointerPosition.y,
          style: 'stroke: lightgray; stroke-width: 2px',
        })
      ),
      z.each(this.state, (spline, splineIndex) =>
        z.if(this.hasTag, () =>
          z('text.tag', {
            'text-anchor': this.tag.align,
            x: this.state[splineIndex][0].x + this.tag.xoffset,
            y: this.state[splineIndex][0].y + this.tag.yoffset,
            style: `
              fill: #333;
              font-size: 14px;
              user-select: none;
              cursor: ${this.getTagCursor()};
            `,
            onmount: el => {
              if (!this.params.readonly) {
                el.addEventListener('dblclick', (event) => {
                  if (this.selectMode) {
                    let val = prompt('Enter tag value:');
                    if (val === null) {
                      return; // Happens when cancel button is pressed in prompt window
                    }
                    val.trim();
                    if (val !== '') {
                      this.state[splineIndex][0].tag = val;
                      this.app.addUndoPoint();
                      this.render();
                    }
                  }
                });
              }
            }
          }, this.state[splineIndex][0].tag)
        )
      )
    );
  }

  inBoundsX(x) {
    return x >= this.bounds.xmin && x <= this.bounds.xmax;
  }

  inBoundsY(y) {
    return y >= this.bounds.ymin && y <= this.bounds.ymax;
  }
}

function polylinePathData(points) {
  if (points.length < 2) return '';

  const coords = points.map(p => `${p.x},${p.y}`);
  return `M${ coords[0] }L${ coords.splice(1).join(' ') }`;
}

function cubicSplinePathData(points) {
  if (points.length < 4) return '';

  const coords = points.map(p => `${p.x},${p.y}`);
  return `M${ coords[0] }C${ coords.splice(1).join(' ') }`;
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function add(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y,
  }
}

function substract(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y,
  };
}

function scale(point, factor) {
  return {
    x: point.x * factor,
    y: point.y * factor,
  };
}

function direction(point) {
  const magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
  return {
    x: point.x / magnitude,
    y: point.y / magnitude,
  };
}

// Bounding box of a cubic bezier curve
// https://github.com/adobe-webplatform/Snap.svg/blob/master/src/path.js#L849
function getBoundingBox(x0, y0, x1, y1, x2, y2, x3, y3) {
  var tvalues = [],
      bounds = [[], []],
      a, b, c, t, t1, t2, b2ac, sqrtb2ac;
  for (var i = 0; i < 2; ++i) {
      if (i == 0) {
          b = 6 * x0 - 12 * x1 + 6 * x2;
          a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
          c = 3 * x1 - 3 * x0;
      } else {
          b = 6 * y0 - 12 * y1 + 6 * y2;
          a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
          c = 3 * y1 - 3 * y0;
      }
      if (Math.abs(a) < 1e-12) {
          if (Math.abs(b) < 1e-12) {
              continue;
          }
          t = -c / b;
          if (0 < t && t < 1) {
              tvalues.push(t);
          }
          continue;
      }
      b2ac = b * b - 4 * c * a;
      sqrtb2ac = Math.sqrt(b2ac);
      if (b2ac < 0) {
          continue;
      }
      t1 = (-b + sqrtb2ac) / (2 * a);
      if (0 < t1 && t1 < 1) {
          tvalues.push(t1);
      }
      t2 = (-b - sqrtb2ac) / (2 * a);
      if (0 < t2 && t2 < 1) {
          tvalues.push(t2);
      }
  }

  var x, y, j = tvalues.length,
      jlen = j,
      mt;
  while (j--) {
      t = tvalues[j];
      mt = 1 - t;
      bounds[0][j] = (mt * mt * mt * x0) + (3 * mt * mt * t * x1) + (3 * mt * t * t * x2) + (t * t * t * x3);
      bounds[1][j] = (mt * mt * mt * y0) + (3 * mt * mt * t * y1) + (3 * mt * t * t * y2) + (t * t * t * y3);
  }

  bounds[0][jlen] = x0;
  bounds[1][jlen] = y0;
  bounds[0][jlen + 1] = x3;
  bounds[1][jlen + 1] = y3;
  bounds[0].length = bounds[1].length = jlen + 2;

  return {
    min: {x: Math.min.apply(0, bounds[0]), y: Math.min.apply(0, bounds[1])},
    max: {x: Math.max.apply(0, bounds[0]), y: Math.max.apply(0, bounds[1])}
  };
}

const strokeWidth = 2;  // TODO: pass in
function computeDashArray(dashStyle) {
  var scale = Math.pow(strokeWidth, 0.6); // seems about right perceptually
  switch (dashStyle) {
    case 'dashed': return 5*scale + ',' + 3*scale;
    case 'longdashed': return 10*scale + ',' + 3*scale;
    case 'dotted': return 2*scale + ',' + 2*scale;
    case 'dashdotted': return 7*scale + ',' + 3*scale + ',' + 1.5*scale + ',' + 3*scale;
    case 'solid':  // falls through
    default: return '';
  }
}
