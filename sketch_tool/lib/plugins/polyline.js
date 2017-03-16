import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';
import { injectStyleSheet, injectSVGDefs } from 'sketch2/util/dom-style-helpers';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class Polyline extends BasePlugin {

  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/polyline/polyline-icon.svg',
      alt: 'Polyline tool'
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addPolyline', (id, index) => {this.addPolyline(id, index)});
    this.app.__messageBus.on('deletePolylines', () => {this.deletePolylines()});
    this.wasDragged = false;
  }

  getGradeable() {
    let result = [],
        lastPtIndex = this.state.length - 1,
        x1, y1, x2, y2;
    if (lastPtIndex > 0) {
      for (let i = 0; i < lastPtIndex; i++) {
        x1 = this.state[i].x;
        y1 = this.state[i].y;
        x2 = this.state[i+1].x;
        y2 = this.state[i+1].y;
        // Use a spline to describe a line segment of polyline
        result.push({
          spline: [
            [x1, y1],
            [(2*x1 + x2)/3, (2*y1 + y2)/3],
            [(x1 + 2*x2)/3, (y1 + 2*y2)/3],
            [x2, y2]
          ]
        });
      }
    }
    return result;
  }

  addPolyline(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deletePolylines() {
    if (this.delIndices.length !== 0) {
      this.state.length = 0;
      this.delIndices.length = 0;
      this.render();
    }
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the line segment shape
  initDraw(event) {
    let x = event.clientX - this.params.left,
        y = event.clientY - this.params.top;

    // Push current position
    this.state.push({
      x: x,
      y: y
    });
    this.app.addUndoPoint();
    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    z.render(this.el,
      z.if(this.state.length === 1, () =>
        z('circle', {
            cx: this.state[0].x,
            cy: this.state[0].y,
            r: 4,
            style: `
              fill: ${this.params.color};
              stroke: ${this.params.color};
            `,
        })
      ),
      z('polyline.visible-' + 0 + '.polyline' + '.plugin-id-' + this.id, {
        points: polylineData(this.state),
        style: `
              stroke: ${this.params.color};
              stroke-width: 2px;
              stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
              fill: none;
            `
      }),
      z('polyline.invisible-' + 0, {
        points: polylineData(this.state),
        style: `
              stroke: ${this.params.color};
              stroke-width: 10px;
              stroke-dasharray: solid;
              fill: none;
              opacity: 0;
            `,
        onmount: el => {
          this.app.registerElement({
            ownerID: this.params.id,
            element: el,
            initialBehavior: 'none',
            onDrag: ({dx, dy}) => {
              this.state.forEach(function (pt) {
                pt.x += dx;
                pt.y += dy;
              });
              this.render();
            },
            inBoundsX: (dx) => {
              for (let pt of this.state) {
                if (!this.inBoundsX(pt.x + dx)) {
                  return false;
                }
              }
              return true;
            },
            inBoundsY: (dy) => {
              for (let pt of this.state) {
                if (!this.inBoundsY(pt.y + dy)) {
                  return false;
                }
              }
              return true;
            }
          });
        }
      }),
      // Draw invisible and selectable line endpoints
      z.each(this.state, (pt, ptIndex) =>
        z('circle.invisible-' + ptIndex, {
          cx: this.state[ptIndex].x,
          cy: this.state[ptIndex].y,
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
                this.state[ptIndex].x += dx;
                this.state[ptIndex].y += dy;
                this.render();
              },
              inBoundsX: (dx) => {
                return this.inBoundsX(this.state[ptIndex].x + dx);
              },
              inBoundsY: (dy) => {
                return this.inBoundsY(this.state[ptIndex].y + dy)
              },
            });
          }
        })
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

function polylineData(points) {
  const coords = points.map(p => `${p.x},${p.y}`);
  return coords.join(' ');
}
