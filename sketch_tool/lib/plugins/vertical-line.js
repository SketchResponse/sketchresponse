import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class VerticalLine extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/vertical-line/vertical-line-icon.svg',
      alt: 'Vertical line tool'
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addVerticalLine', (id, index) => {this.addVerticalLine(id, index)});
    this.app.__messageBus.on('deleteVerticalLines', () => {this.deleteVerticalLines()});
    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
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

  addVerticalLine(id, index) {
    if (this.id == id) {
      this.delIndices.push(index);
    }
  }

  deleteVerticalLines() {
    if (this.delIndices.length != 0) {
      this.delIndices.sort();
      for (let i = this.delIndices.length -1; i >= 0; i--) {
        this.state.splice(this.delIndices[i], 1);
      }
      this.delIndices.length = 0;
      this.render();
    }
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the horizontal line shape
  initDraw(event) {
    // Add event listeners in capture phase
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.currentPosition = event.clientX - this.params.left;
    this.state.push(this.currentPosition);
    this.render();
  }

  drawMove(event) {
    let x = event.clientX - this.params.left;
    x = this.clampX(x);
    this.state[this.state.length-1] = x;
    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  drawEnd(event) {
    document.removeEventListener('pointermove', this.drawMove, true);
    document.removeEventListener('pointerup', this.drawEnd, true);
    document.removeEventListener('pointercancel', this.drawEnd, true);
    this.app.addUndoPoint();
    event.stopPropagation();
    event.preventDefault();
  }

  render() {
    z.render(this.el,
      // Draw visible line, under invisible line
      z.each(this.state, (position, positionIndex) =>
        z('line.visible-' + positionIndex + '.vertical-line' + '.plugin-id-' + this.id, {
          x1: position,
          y1: 0,
          x2: position,
          y2: this.params.height,
          style: `
            stroke: ${this.params.color};
            stroke-width: 2px;
            stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
          `
        })
      ),
      // Draw invisible and selectable line
      z.each(this.state, (position, positionIndex) =>
        z('line.invisible-' + positionIndex, {
          x1: position,
          y1: 0,
          x2: position,
          y2: this.params.height,
          style: `
            stroke: ${this.params.color};
            opacity: 0;
            stroke-width: 10px;
            stroke-dasharray: solid;
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
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

  clampX(x) {
    if (x < this.bounds.xmin) {
      return this.bounds.xmin;
    }
    else if (x > this.bounds.xmax) {
      return this.bounds.xmax
    }
    else {
      return x;
    }
  }

  clampY(y) {
    if (y < this.bounds.ymin) {
      return this.bounds.ymin;
    }
    else if (y > this.bounds.ymax) {
      return this.bounds.ymax
    }
    else {
      return y;
    }
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
