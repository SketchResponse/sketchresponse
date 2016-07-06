import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class VerticalLine extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/vertical-line/icon.svg',
      alt: 'Vertical line tool'
    };
    super(params, app);
  }

  getGradeable() {
    const yvals = [
      0,
      Math.round(this.params.height / 3),
      Math.round(2 * this.params.height / 3),
      this.params.height,
    ];

    return this.state.map(x => {
      return {
        spline: yvals.map(y => [x, y]),
      };
    });
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the horizontal line shape
  initDraw(event) {
    this.currentPosition = event.clientX - this.params.left;
    this.state.push(this.currentPosition);
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, (position, positionIndex) =>
        z('line', {
          x1: position,
          y1: 0,
          x2: position,
          y2: this.params.height,
          style: `
            stroke: ${this.params.color};
            stroke-width: 2px;
            stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'drag',
              onDrag: ({dx, dy}) => {
                this.state[positionIndex] += dx;
                this.render();
              },
              inBoundsX: (dx) => {
                return this.inBoundsX(this.state[positionIndex] + dx)
              },
              inBoundsY: (dy) => {
                return true;
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
    return true;
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
