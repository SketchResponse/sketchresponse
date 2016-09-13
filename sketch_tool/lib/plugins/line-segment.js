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
        <marker id="arrowhead-${params.id}" markerWidth="${length}" markerHeight="${base}" refX="${length}" refY="${refY}" orient="auto">
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
    // Message listeners
    this.app.__messageBus.on('addLineSegment', (id, index) => {this.addLineSegment(id, index)});
    this.app.__messageBus.on('addLineSegmentPoint', (id, index) => {this.addLineSegmentPoint(id, index)});
    this.app.__messageBus.on('deleteLineSegments', () => {this.deleteLineSegments()});
    this.app.__messageBus.on('deleteLineSegmentPoints', () => {this.deleteLineSegmentPoints()});
    this.hConstraint = false;
    this.vConstraint = false;
    this.rConstraint = false;

    if (params.directionConstraint) {
      this.hConstraint = params.directionConstraint == 'horizontal' ? true : false;
      this.vConstraint = params.directionConstraint == 'vertical' ? true : false;
    }
    if (params.lengthConstraint) {
      this.rConstraint = true;
      this.rConstraintValue = params.lengthConstraint;
    }
    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
    this.wasDragged = false;
    this.firstPoint = true;
    this.delIndices1 = [];
  }

  getGradeable() {
    return this.state.map(spline => {
      return {
        spline: spline.map(point => [point.x, point.y])
      };
    });
  }

  addLineSegment(id, index) {
    if (this.id == id) {
      this.delIndices.push(index);
    }
  }

  addLineSegmentPoint(id, index) {
    if (this.id == id) {
      this.delIndices1.push(index);
    }
  }

  deleteLineSegments() {
    if (this.delIndices.length != 0) {
      this.delIndices.sort();
      for (let i = this.delIndices.length -1; i >= 0; i--) {
        this.state.splice(this.delIndices[i], 2);
      }
      this.delIndices.length = 0;
      this.render();
    }
  }

  deleteLineSegmentPoints() {
    if (this.delIndices1.length != 0) {
      this.delIndices1.sort();
      for (let i = this.delIndices1.length -1; i >= 0; i--) {
        this.state.splice(this.delIndices1[i], 1);
      }
      this.delIndices1.length = 0;
      this.render();
    }
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the line segment shape
  initDraw(event) {
    // Add event listeners in capture phase
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.firstPoint = (this.state.length % 2 == 0);
    // Push current position
    let point = this.rConstrained(event.clientX - this.params.left, event.clientY - this.params.top),
        xConstrained = this.vConstrained(point.x),
        yConstrained = this.hConstrained(point.y);
    this.state.push({
      x: xConstrained,
      y: yConstrained
    });
    // If first endpoint, add immediately an undo point.
    // Otherwise, wait until drawEnd has been called to take in account eventual movemements
    // in drawMove.
    if (this.firstPoint) {
      this.app.addUndoPoint();
    }
    this.render();
    event.stopPropagation();
    event.preventDefault();
  }

  drawMove(event) {
    let x = event.clientX - this.params.left,
        y = event.clientY - this.params.top;

    x = this.clampX(x);
    y = this.clampY(y);
    // On a click & drag, only push a new point if we are dragging from the first endpoint
    // and the second endpoint has not been already added.
    if (this.firstPoint && this.state.length % 2 != 0) {
      this.state.push({
        x: this.vConstrained(x),
        y: this.hConstrained(y)
      });
    }
    else {
      let lastPosition = this.state[this.state.length-1],
          point = this.rConstrained1(x, y),
          xConstrained = this.vConstrained1(point.x),
          yConstrained = this.hConstrained1(point.y);
      lastPosition.x = xConstrained;
      lastPosition.y = yConstrained;
    }
    this.render();
    this.wasDragged = true;
    event.stopPropagation();
    event.preventDefault();
  }

  drawEnd(event) {
    document.removeEventListener('pointermove', this.drawMove, true);
    document.removeEventListener('pointerup', this.drawEnd, true);
    document.removeEventListener('pointercancel', this.drawEnd, true);
    // Only add an undo point for first endpoint if there was a drag.
    // Always add an undo point for second end point.
    if (!this.firstPoint || (this.firstPoint && this.wasDragged)) {
      this.app.addUndoPoint();
    }
    this.wasDragged = false;
    event.stopPropagation();
    event.preventDefault();
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

  rConstrained(x2, y2) {
    let len = this.state.length,
        result = {
          x: x2,
          y: y2
        };
    if (this.rConstraint && (len != 0) && (len % 2 != 0)) {
      let x1 = this.state[len-1].x, y1 = this.state[len-1].y,
          vx = x2 - x1, vy = y2 - y1,
          dist = Math.sqrt(vx**2 + vy**2);
      if (dist > this.rConstraintValue) {
        let theta = Math.atan2(vy, vx);
        result.x = x1 + this.rConstraintValue*Math.cos(theta);
        result.y = y1 + this.rConstraintValue*Math.sin(theta);
      }
    }
    return result;
  }

  hConstrained1(y) {
    let len = this.state.length;
    return this.hConstraint && (len != 0) && (len % 2 == 0) ? this.state[len-1].y : y;
  }

  vConstrained1(x) {
    let len = this.state.length;
    return this.vConstraint && (len != 0) && (len % 2 == 0) ? this.state[len-1].x : x;
  }

  rConstrained1(x2, y2) {
    let len = this.state.length,
        result = {
          x: x2,
          y: y2
        };
    if (this.rConstraint && (len != 0) && (len % 2 == 0)) {
      let x1 = this.state[len-2].x, y1 = this.state[len-2].y,
          vx = x2 - x1, vy = y2 - y1,
          dist = Math.sqrt(vx**2 + vy**2);
      if (dist > this.rConstraintValue) {
        let theta = Math.atan2(vy, vx);
        result.x = x1 + this.rConstraintValue*Math.cos(theta);
        result.y = y1 + this.rConstraintValue*Math.sin(theta);
      }
    }
    return result;
  }

  hConstrained2(y, index) {
    let len = this.state.length;
    return this.hConstraint && (len != 0) && (len % 2 == 0) ? this.state[index].y : y;
  }

  vConstrained2(x, index) {
    let len = this.state.length;
    return this.vConstraint && (len != 0) && (len % 2 == 0) ? this.state[index].x : x;
  }

  rConstrained2(x, y, index) {
    let len = this.state.length,
        result = {
          x: x,
          y: y
        };
    if (this.rConstraint && (len != 0) && (len % 2 == 0)) {
      let xf, yf, xm, ym, vx, vy, dist;
      // First end point
      if (index % 2 == 0) {
        xm = x; ym = y;
        xf = this.state[index+1].x; yf = this.state[index+1].y;
      }
      // Second endpoint
      else {
        xf = this.state[index-1].x; yf = this.state[index-1].y;
        xm = x; ym = y;
      }
      vx = xm - xf, vy = ym - yf;
      dist = Math.sqrt(vx**2 + vy**2);
      if (dist > this.rConstraintValue) {
        let theta = Math.atan2(vy, vx);
        result.x = xf + this.rConstraintValue*Math.cos(theta);
        result.y = yf + this.rConstraintValue*Math.sin(theta);
      }
    }
    return result;
  }
  // END TODO

  pointOpacity(ptIndex) {
    return (ptIndex == this.state.length - 1) && (ptIndex % 2 == 0) ? '' : 'opacity: 0';
  }

  pointClass(ptIndex) {
    return (ptIndex == this.state.length - 1) && (ptIndex % 2 == 0) ? '.line-segment-point' + '.plugin-id-' + this.id : '';
  }

  pointRadius(ptIndex) {
    return (ptIndex == this.state.length - 1) && (ptIndex % 2 == 0) ? 4 : 8;
  }

  arrowHead() {
    return this.params.arrowHead ? `url(#arrowhead-${this.params.id})` : ''
  }

  render() {
    z.render(this.el,
      // Draw visible line, under invisible line and endpoints
      z.each(this.state, (pt, ptIndex) =>
        z.if(ptIndex % 2 == 0 && ptIndex < this.state.length - 1, () =>
          z('line.visible-' + ptIndex + '.line-segment' + '.plugin-id-' + this.id, {
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
        z.if(ptIndex % 2 == 0 && ptIndex < this.state.length - 1, () =>
          z('line.invisible-' + ptIndex, {
            x1: this.state[ptIndex].x,
            y1: this.state[ptIndex].y,
            x2: this.state[ptIndex+1].x,
            y2: this.state[ptIndex+1].y,
            style: `
              stroke: ${this.params.color};
              opacity: 0;
              stroke-width: 10px;
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
        z('circle.invisible-' + (ptIndex % 2 == 0 ? ptIndex : (ptIndex - 1).toString()) + this.pointClass(ptIndex), {
          cx: this.state[ptIndex].x,
          cy: this.state[ptIndex].y,
          r: this.pointRadius(ptIndex),
          style: `
            fill: ${this.params.color};
            stroke-width: 0;
          ` + this.pointOpacity(ptIndex),
          onmount: el => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({dx, dy}) => {
                let x = this.state[ptIndex].x + dx,
                    y = this.state[ptIndex].y + dy,
                    point = this.rConstrained2(x, y, ptIndex),
                    xConstrained = this.vConstrained2(point.x, ptIndex),
                    yConstrained = this.hConstrained2(point.y, ptIndex);

                this.state[ptIndex].x = xConstrained;
                this.state[ptIndex].y = yConstrained;
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
