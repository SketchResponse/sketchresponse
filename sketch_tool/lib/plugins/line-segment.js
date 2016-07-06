import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class LineSegment extends BasePlugin {

  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/line-segment/icon.svg',
      alt: 'Line segment tool'
    };
    super(params, app);
  }

  getGradeable() {
    return this.state.map(spline => {
      return {
        spline: spline.map(point => [point.x, point.y])
      };
    });
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the line segment shape
  initDraw(event) {
    this.currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    this.state.push(this.currentPosition);
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    let nbrPts = this.state.length, lastPtIndex = nbrPts - 1;

    z.render(this.el,
      // Draw lines first, under points
      z.each(this.state, (pt, ptIndex) =>
        z.if(ptIndex % 2 == 0 && ptIndex < lastPtIndex, () =>
          z('line', {
            x1: this.state[ptIndex].x,
            y1: this.state[ptIndex].y,
            x2: this.state[ptIndex+1].x,
            y2: this.state[ptIndex+1].y,
            style: `
              stroke: ${this.params.color};
              stroke-width: 2px;
              stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
            `
          })
        )
      ),
      // Draw line endpoints
      z.each(this.state, (pt, ptIndex) =>
        z('circle', {
          cx: this.state[ptIndex].x,
          cy: this.state[ptIndex].y,
          r: 5,
          style: `
            fill: ${this.params.color};
            stroke-width: 0;
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'drag',
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
