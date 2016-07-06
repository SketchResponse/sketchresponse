import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';
import { injectStyleSheet, injectSVGDefs } from 'sketch2/util/dom-style-helpers';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class LineSegment extends BasePlugin {

  constructor(params, app) {
    // Add params that are specific to this plugin
    if (params.arrowHead) {
      let length = params.arrowHead.length,
          base = params.arrowHead.base,
          refY = base/2;
      params.icon = {
        src: './plugins/line-segment/arrow-icon.svg',
        alt: 'Line segment tool'
      };
      injectSVGDefs(`
        <marker id="arrowhead" markerWidth="${length}" markerHeight="${base}" refX="${length}" refY="${refY}" orient="auto">
          <polygon points="0 0, ${length} ${refY}, 0 ${base}" style="fill: ${params.color}; stroke: ${params.color}; stroke-width: 1;"/>
        </marker>`
      );
    }
    else {
      params.icon = {
        src: './plugins/line-segment/line-icon.svg',
        alt: 'Line segment tool'
      };
    }

    super(params, app);

    this.hConstraint = false;
    this.vConstraint = false;

    if (params.directionConstraint) {
      this.hConstraint = params.directionConstraint == 'horizontal' ? true : false;
      this.vConstraint = params.directionConstraint == 'vertical' ? true : false;
    }
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
    if (this.currentPointerId) return;

    this.currentPointerId = event.pointerId;
    this.app.svg.setPointerCapture(event.pointerId);
    this.app.svg.addEventListener('pointermove', this.drawMove.bind(this));
    this.app.svg.addEventListener('pointerup', this.drawEnd.bind(this));
    this.app.svg.addEventListener('pointercancel', this.drawEnd.bind(this));
    // Push current position
    let xConstrained = this.vConstrained(event.clientX - this.params.left),
        yConstrained = this.hConstrained(event.clientY - this.params.top);
    this.state.push({
      x: xConstrained,
      y: yConstrained
    });
    this.isDragging = false;
    this.drawingFinished = false;
    this.app.addUndoPoint();
    this.render();
  }

  drawMove(event) {
    if (event.pointerId !== this.currentPointerId) return;

    let x = event.clientX - this.params.left,
        y = event.clientY - this.params.top;

    x = this.clampX(x);
    y = this.clampY(y);

    if (!this.isDragging) {
      this.state.push({
        x: this.vConstrained(x),
        y: this.hConstrained(y)
      });
      this.isDragging = true;
    }
    else {
      let lastPosition = this.state[this.state.length-1];
      lastPosition.x = this.vConstrained1(x);
      lastPosition.y = this.hConstrained1(y);
    }
    this.render();
  }

  drawEnd(event) {
    if (!this.drawingFinished) {
      this.currentPointerId = null;
      this.app.svg.removeEventListener('pointermove', this.drawMove);
      this.app.svg.removeEventListener('pointerup', this.drawEnd);
      this.app.svg.removeEventListener('pointercancel', this.drawEnd);
      this.app.svg.releasePointerCapture(event.pointerId);
      if (this.isDragging) {
        this.app.addUndoPoint();
      }
      this.isDragging = false;
      this.render();
      this.drawingFinished = true;
      event.stopPropagation();
    }
  }

  // TODO: refactor
  hConstrained(y) {
    let len = this.state.length;
    return this.hConstraint && (len != 0) && (len % 2 != 0) ? this.state[len-1].y : y;
  }

  vConstrained(x) {
    let len = this.state.length;
    return this.vConstraint && (len != 0) && (len % 2 != 0) ? this.state[len-1].x : x;
  }

  hConstrained1(y) {
    let len = this.state.length;
    return this.hConstraint && (len != 0) && (len % 2 == 0) ? this.state[len-1].y : y;
  }

  vConstrained1(x) {
    let len = this.state.length;
    return this.vConstraint && (len != 0) && (len % 2 == 0) ? this.state[len-1].x : x;
  }
  // END TODO

  pointOpacity(ptIndex) {
    return (ptIndex == this.state.length - 1) && (ptIndex % 2 == 0) ? 0.5 : 0;
  }

  pointRadius(ptIndex) {
    return (ptIndex == this.state.length - 1) && (ptIndex % 2 == 0) ? 4 : 8;
  }

  arrowHead() {
    return this.params.arrowHead ? 'url(#arrowhead)' : ''
  }

  render() {
    let lastPtIndex = this.state.length - 1;

    z.render(this.el,
      // Draw visible line, under invisible line and endpoints
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
              marker-end: ${this.arrowHead()};
            `
          })
        )
      ),
      // Draw invisible and selectable line, under invisible endpoints
      z.each(this.state, (pt, ptIndex) =>
        z.if(ptIndex % 2 == 0 && ptIndex < lastPtIndex, () =>
          z('line', {
            x1: this.state[ptIndex].x,
            y1: this.state[ptIndex].y,
            x2: this.state[ptIndex+1].x,
            y2: this.state[ptIndex+1].y,
            style: `
              stroke: ${this.params.color};
              opacity: 0;
              stroke-width: 6px;
              stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
            `,
            onmount: el => {
              this.app.registerElement({
                ownerID: this.params.id,
                element: el,
                initialBehavior: 'none',
                onDrag: ({dx, dy}) => {
                  this.state[ptIndex].x += dx;
                  this.state[ptIndex].y += dy;
                  this.state[ptIndex+1].x += dx;
                  this.state[ptIndex+1].y += dy;
                  this.render();
                },
                inBoundsX: (dx) => {
                  return this.inBoundsX(this.state[ptIndex].x + dx) &&
                         this.inBoundsX(this.state[ptIndex+1].x + dx);
                },
                inBoundsY: (dy) => {
                  return this.inBoundsY(this.state[ptIndex].y + dy) &&
                         this.inBoundsY(this.state[ptIndex+1].y + dy)
                },
              });
            }
          })
        )
      ),
      // Draw invisible and selectable line endpoints
      z.each(this.state, (pt, ptIndex) =>
        z('circle', {
          cx: this.state[ptIndex].x,
          cy: this.state[ptIndex].y,
          r: this.pointRadius(ptIndex),
          style: `
            fill: ${this.params.color};
            opacity: ${this.pointOpacity(ptIndex)};
            stroke-width: 0;
          `,
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                if (!this.vConstraint) {
                  this.state[ptIndex].x += dx;
                }
                if (!this.hConstraint) {
                  this.state[ptIndex].y += dy;
                }
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
