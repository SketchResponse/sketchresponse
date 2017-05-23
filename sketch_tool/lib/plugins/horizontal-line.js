import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class HorizontalLine extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/horizontal-line/horizontal-line-icon.svg',
      alt: 'Horizontal line tool',
      color: params.color
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addHorizontalLine', (id, index) => {this.addHorizontalLine(id, index)});
    this.app.__messageBus.on('deleteHorizontalLines', () => {this.deleteHorizontalLines()});
    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
  }

  getGradeable() {
    const xvals = [
      0,
      Math.round(this.params.width / 3),
      Math.round(2 * this.params.width / 3),
      this.params.width,
    ];

    return this.state.map(position => {
      return {
        spline: xvals.map(x => [x, position.y]),
        tag: position.tag
      };
    });
  }

  addHorizontalLine(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteHorizontalLines() {
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
      y: event.clientY - this.params.top
    }
    if (this.hasTag) {
      this.currentPosition.tag = this.tag.value;
    }
    this.state.push(this.currentPosition);
    this.render();
  }

  drawMove(event) {
    let y = event.clientY - this.params.top;
    y = this.clampY(y);
    this.state[this.state.length-1].y = y;
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
        z('line.visible-' + positionIndex + '.horizontal-line' + '.plugin-id-' + this.id, {
          x1: 0,
          y1: position.y,
          x2: this.params.width,
          y2: position.y,
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
          x1: 0,
          y1: position.y,
          x2: this.params.width,
          y2: position.y,
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
                this.state[positionIndex].y += dy;
                this.render();
              },
              inBoundsX: (dx) => {
                return true;
              },
              inBoundsY: (dy) => {
                return this.inBoundsY(this.state[positionIndex].y + dy)
              },
            });
          }
        })
      ),
      z.each(this.state, (position, positionIndex) =>
        z.if(this.hasTag, () =>
          z('text.tag', {
            'text-anchor': this.tag.align,
            x: this.params.width/2 + this.tag.xoffset,
            y: position.y + this.tag.yoffset,
            style: `
              fill: #333;
              font-size: 14px;
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
                      this.state[positionIndex].tag = val;
                      this.app.addUndoPoint();
                      this.render();
                    }
                  }
                });
              }
            }
          }, this.state[positionIndex].tag)
        )
      )
    );
  }

  inBoundsX(x) {
    return true;
  }

  inBoundsY(y) {
    return y >= this.bounds.ymin && y <= this.bounds.ymax;
  }
}
