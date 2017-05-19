import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';
import fitCurve from './freeform/fitcurve';
import { injectStyleSheet, injectSVGDefs } from 'sketch2/util/dom-style-helpers';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

const FIT_TOLERANCE = 0;
const ROUNDING_PRESCALER = 100;

export default class Spline extends BasePlugin {

  constructor(params, app) {
    let iconSrc = './plugins/spline/spline-icon.svg';
    // Add params that are specific to this plugin
    params.icon = {
      src: iconSrc,
      alt: 'Spline tool',
      color: params.color
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addSpline', (id, index) => {this.addSpline(id, index)});
    this.app.__messageBus.on('deleteSplines', () => {this.deleteSplines()});
    this.app.__messageBus.on('finalizeShapes', (id) => {this.drawEnd(id)});
  }

  getGradeable() {
    // Do not take in account single points
    let result = this.state.filter(spline => spline.length >= 2);
    // State contains arrays of points of user clicks.
    // Convert these to spline data.
    return result.map(spline => {
      return {
        spline: splineData(spline).map(point => [point.x, point.y]),
        tag: spline[0].tag
      };
    });
  }

  addSpline(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteSplines() {
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
  // selected the line segment shape
  initDraw(event) {
    let currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top
    };
    // We already have at least one spline defined, add new points to the last one
    if (this.state.length > 0) {
      // Only add tag to first point
      if (this.hasTag && this.state[this.state.length-1].length === 0) {
        currentPosition.tag = this.tag.value;
      }
      this.state[this.state.length-1].push(currentPosition);
    }
    // Create our first spline
    else {
      // Only add tag to first point
      if (this.hasTag) {
        currentPosition.tag = this.tag.value;
      }
      this.state.push([currentPosition]);
    }
    this.app.addUndoPoint();
    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  drawEnd(id) {
    // To signal that a spline has been completed, push an empty array
    if (id !== this.id && id !== 'undo' && id !== 'redo' &&
        this.state.length > 0 && this.state[this.state.length-1].length > 0) {
      this.state.push([]);
      this.app.addUndoPoint();
    }
    this.render();
  }

  splineStrokeWidth(index) {
    return index === this.state.length-1 ? '3px' : '2px';
  }

  render() {
    z.render(this.el,
      // Draw visible elements under invisible elements
      z.each(this.state, (spline, splineIndex) =>
        // Draw spline
        z('path.visible-' + splineIndex + '.spline' + '.plugin-id-' + this.id, {
          d: splinePathData(this.state[splineIndex]),
          style: `
              stroke: ${this.params.color};
              stroke-width: ${this.splineStrokeWidth(splineIndex)};
              stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
              fill: none;
            `
        })
      ),
      // Draw points
      z.each(this.state, (spline, splineIndex) =>
        z.each(spline, (pt, ptIndex) =>
          z('circle.visible-' + splineIndex + '.spline' + '.plugin-id-' + this.id, {
            cx: this.state[splineIndex][ptIndex].x,
            cy: this.state[splineIndex][ptIndex].y,
            r: 3,
            style: `
              fill: ${this.params.color};
              stroke: none;
            `
          })
        )
      ),
      z.each(this.state, (spline, splineIndex) =>
        // Draw invisible and selectable spline under invisible points
        z('path.invisible-' + splineIndex + this.readOnlyClass(), {
          d: splinePathData(this.state[splineIndex]),
          style: `
              stroke: ${this.params.color};
              stroke-width: 10px;
              fill: none;
              opacity: 0;
            `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                for (let pt of this.state[splineIndex]) {
                  pt.x += dx;
                  pt.y += dy;
                }
                this.render();
              },
              inBoundsX: (dx) => {
                for (let pt of this.state[splineIndex]) {
                  if (!this.inBoundsX(pt.x + dx)) {
                    return false;
                  }
                }
                return true;
              },
              inBoundsY: (dy) => {
                for (let pt of this.state[splineIndex]) {
                  if (!this.inBoundsY(pt.y + dy)) {
                    return false;
                  }
                }
                return true;
              }
            });
          }
        })
      ),
      z.each(this.state, (spline, splineIndex) =>
        // Draw invisible and selectable points
        z.each(spline, (pt, ptIndex) =>
          z('circle.invisible-' + splineIndex + this.readOnlyClass(), {
            cx: this.state[splineIndex][ptIndex].x,
            cy: this.state[splineIndex][ptIndex].y,
            r: 8,
            style: `
              fill: ${this.params.color};
              stroke-width: 0;
              opacity: 0;
            `,
            onmount: el => {
              this.app.registerElement({
                ownerID: this.params.id,
                element: el,
                initialBehavior: 'none',
                onDrag: ({dx, dy}) => {
                  this.state[splineIndex][ptIndex].x += dx;
                  this.state[splineIndex][ptIndex].y += dy;
                  this.render();
                },
                inBoundsX: (dx) => {
                  return this.inBoundsX(this.state[splineIndex][ptIndex].x + dx);
                },
                inBoundsY: (dy) => {
                  return this.inBoundsY(this.state[splineIndex][ptIndex].y + dy)
                },
              });
            }
          })
        )
      ),
      z.each(this.state, (spline, splineIndex) =>
        z.if(this.hasTag && this.state[splineIndex].length > 0 && this.state[splineIndex][0].tag, () =>
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

function splinePathData(points) {
  let coords;
  if (points.length < 2) return '';

  coords = splineData(points).map(p => `${p.x},${p.y}`);
  return `M${ coords[0] }C${ coords.splice(1).join(' ') }`;
}

function splineData(points) {
  let splineData = fitCurve(points, FIT_TOLERANCE);
  splineData.forEach(point => {
    point.x = Math.round(ROUNDING_PRESCALER * point.x) / ROUNDING_PRESCALER;
    point.y = Math.round(ROUNDING_PRESCALER * point.y) / ROUNDING_PRESCALER;
  });
  return splineData;
}
