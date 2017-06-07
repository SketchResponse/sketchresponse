import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class VerticalLine extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/vertical-line/vertical-line-icon.svg',
      alt: 'Vertical line tool',
      color: params.color
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

    return this.state.map(position => {
      return {
        spline: yvals.map(y => [position.x, y]),
        tag: position.tag
      };
    });
  }

  addVerticalLine(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteVerticalLines() {
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
  // selected the horizontal line shape
  initDraw(event) {
    // Add event listeners in capture phase
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.currentPosition = {
      x: event.clientX - this.params.left
    }
    if (this.hasTag) {
      this.currentPosition.tag = this.tag.value;
    }
    this.state.push(this.currentPosition);
    this.render();
  }

  drawMove(event) {
    let x = event.clientX - this.params.left;
    x = this.clampX(x);
    this.state[this.state.length-1].x = x;
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
          x1: position.x,
          y1: 0,
          x2: position.x,
          y2: this.params.height,
          style: `
            stroke: ${this.params.color};
            stroke-width: 2px;
            stroke-dasharray: ${this.computeDashArray(this.params.dashStyle, 2)};
          `
        })
      ),
      // Draw invisible and selectable line
      z.each(this.state, (position, positionIndex) =>
        z('line.invisible-' + positionIndex + this.readOnlyClass(), {
          x1: position.x,
          y1: 0,
          x2: position.x,
          y2: this.params.height,
          style: `
            stroke: ${this.params.color};
            opacity: 0;
            stroke-width: 10px;
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                this.state[positionIndex].x += dx;
                this.render();
              },
              inBoundsX: (dx) => {
                return this.inBoundsX(this.state[positionIndex].x + dx)
              },
              inBoundsY: (dy) => {
                return true;
              },
            });
          }
        })
      ),
      // Tags, regular or rendered by Katex
      z.each(this.state, (position, positionIndex) =>
        z.if(this.hasTag, () =>
          z(this.latex ? 'foreignObject.tag' : 'text.tag', {
            'text-anchor': (this.latex ? undefined : this.tag.align),
            x: position.x + this.tag.xoffset,
            y: this.params.height/2 + this.tag.yoffset,
            style: this.getStyle(),
            onmount: el => {
              if (this.latex) {
                this.renderKatex(el, positionIndex);
              }
              if (!this.params.readonly) {
                this.addDoubleClickEventListener(el, positionIndex);
              }
            },
            onupdate: el => {
              if (this.latex) {
                this.renderKatex(el, positionIndex);
              }
            }
          }, this.latex ? '' : this.state[positionIndex].tag)
        )
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
