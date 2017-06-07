import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';
import {getElementsByClassName} from 'sketch2/util/ms-polyfills';
import katex from 'katex';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class Point extends BasePlugin {
  constructor(params, app) {
    let iconSrc, strokeColor, fillColor;
    // Add params that are specific to this plugin
    iconSrc = params.hollow ? './plugins/point/point-hollow-icon.svg'
                            : './plugins/point/point-icon.svg';
    params.icon = {
      src: iconSrc,
      alt: 'Point tool',
      color: params.color
    };
    super(params, app);
    this.strokeWidth = params.hollow ? 2 : 0;
    this.fillOpacity = params.hollow ? 0 : 1;
    // Given a params.size, to have identical visible radiuses in both cases, we need to shrink
    // the hollow point to take in account the 2px width of the stroke
    this.radius = params.hollow ? (params.size/2)-1 : params.size/2;
    // Message listeners
    this.app.__messageBus.on('addPoint', (id, index) => this.addPoint(id, index));
    this.app.__messageBus.on('deletePoints', () => this.deletePoints());
    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
  }

  getGradeable() {
    return this.state.map(position => {
      return {
        point: [position.x, position.y],
        tag: position.tag
      };
    });
  }

  addPoint(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deletePoints() {
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
  // selected the point shape
  initDraw(event) {
    // Add event listeners in capture phase
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top
    };
    if (this.hasTag) {
      this.currentPosition.tag = this.tag.value;
    }
    this.state.push(this.currentPosition);
    this.render();
  }

  drawMove(event) {
    let x = event.clientX - this.params.left,
        y = event.clientY - this.params.top,
        lastPosition = this.state[this.state.length-1];

    x = this.clampX(x);
    y = this.clampY(y);
    lastPosition.x = x;
    lastPosition.y = y;
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

  getStyle() {
    return this.latex ?
      `
        color: #333;
        font-size: 14px;
        cursor: ${this.getTagCursor()};
        clip-path: url('#clip1');
      ` :
      `
        fill: #333;
        font-size: 14px;
        cursor: ${this.getTagCursor()};
      `
  }

  adjustBoundingBox(el) {
    let bRect = getElementsByClassName(el, 'katex-html')[0].getBoundingClientRect();
    // The foreignObject containing the Katex rendering needs a width and height in Firefox.
    // Add a bit of padding.
    el.setAttributeNS(null, 'width', bRect.width + 2);
    el.setAttributeNS(null, 'height', bRect.height + 2);
    if (this.tag.align !== 'left') {
      if (this.tag.align === 'middle') {
        el.setAttributeNS(null, 'x', position.x - 0.5*bRect.width);
      }
      else if (this.tag.align === 'right') {
        el.setAttributeNS(null, 'x', position.x - bRect.width);
      }
    }
  }

  render() {
    z.render(this.el,
      z.each(this.state, (position, positionIndex) =>
        z('circle.point' + '.plugin-id-' + this.id  + '.state-index-' + positionIndex + this.readOnlyClass(), {
          cx: position.x,
          cy: position.y,
          r: this.radius,
          style: `
            fill: ${this.params.color};
            fill-opacity: ${this.fillOpacity};
            stroke: ${this.params.color};
            stroke-width: ${this.strokeWidth};
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                this.state[positionIndex].x += dx;
                this.state[positionIndex].y += dy;
                this.render();
              },
              inBoundsX: (dx) => {
                return this.inBoundsX(this.state[positionIndex].x + dx);
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
          z(this.latex ? 'foreignObject.tag' : 'text.tag', {
            'text-anchor': this.tag.align,
            x: position.x + this.tag.xoffset,
            y: position.y + this.tag.yoffset,
            style: this.getStyle(),
            onmount: el => {
              if (this.latex) {
                try {
                  katex.render(this.state[positionIndex].tag, el, {
                    errorColor: '#0000ff'
                  });
                  this.adjustBoundingBox(el);
                }
                catch(e) {
                  katex.render('\\text{\\color{red}{Error: invalid markup}}', el, {
                    errorColor: '#0000ff'
                  });
                }
              }
              if (!this.params.readonly) {
                el.addEventListener('dblclick', (event) => {
                  if (this.selectMode) {
                    let val = prompt('Enter tag value:', this.state[positionIndex].tag);
                    if (val === null) {
                      return; // Happens when cancel button is pressed in prompt window
                    }
                    val.trim();
                    if (val !== '' && val !== this.state[positionIndex].tag) {
                      this.state[positionIndex].tag = val;
                      this.app.addUndoPoint();
                      this.render();
                    }
                  }
                });
              }
            },
            onupdate: el => {
              if (this.latex) {
                try {
                  katex.render(this.state[positionIndex].tag, el, {
                    errorColor: '#0000ff'
                  });
                  this.adjustBoundingBox(el);
                }
                catch(e) {
                  katex.render('\\text{\\color{red}{Error: invalid markup}}', el, {
                    errorColor: '#0000ff'
                  });
                }
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
    return y >= this.bounds.ymin && y <= this.bounds.ymax;
  }
}
