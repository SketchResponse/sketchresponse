import deepExtend from 'deep-extend';
import z from '../util/zdom';
import BasePlugin from './base-plugin';
import fitCurve from './freeform/fitcurve';
import { validate } from '../config-validator';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.2';

const FIT_TOLERANCE = 0;
const ROUNDING_PRESCALER = 100;

const DEFAULT_PARAMS = {
  label: 'Polyline',
  color: 'dimgray',
  dashStyle: 'solid',
  closed: false,
  fillColor: 'none',
  opacity: 1,
};

function polylinePathData(points, closed) {
  if (points.length < 2) return '';
  const coords = points.map((p) => `${p.x},${p.y}`);
  const result = `M${coords[0]} L${coords.splice(1).join(' L')}`;
  return closed ? `${result} L${coords[0]}` : result;
}

function splineData(points) {
  const result = fitCurve(points, FIT_TOLERANCE);
  result.forEach((point) => {
     /* eslint-disable no-param-reassign */
    point.x = Math.round(ROUNDING_PRESCALER * point.x) / ROUNDING_PRESCALER;
    point.y = Math.round(ROUNDING_PRESCALER * point.y) / ROUNDING_PRESCALER;
     /* eslint-enable no-param-reassign */
  });
  return result;
}

export default class Polyline extends BasePlugin {
  constructor(params, app) {
    const plParams = BasePlugin.generateDefaultParams(DEFAULT_PARAMS, params);
    if (!app.debug || validate(params, 'polyline')) {
      deepExtend(plParams, params);
    } else {
      // eslint-disable-next-line no-console
      console.log('The polyline config has errors, using default values instead');
    }
    const iconSrc = plParams.closed ? './lib/plugins/polyline/polyline-closed-icon.svg'
                                  : './lib/plugins/polyline/polyline-open-icon.svg';
    // Add params that are specific to this plugin
    plParams.icon = {
      src: iconSrc,
      alt: 'Polyline tool',
      color: plParams.color,
    };
    if (plParams.closed && plParams.fillColor !== 'none') {
        plParams.icon.fillColor = plParams.fillColor;
    }
    // Add versions
    plParams.version = VERSION;
    plParams.gradeableVersion = GRADEABLE_VERSION;
    super(plParams, app);
    // Message listeners
    this.app.__messageBus.on('addPolyline', (id, index) => { this.addPolyline(id, index); });
    this.app.__messageBus.on('deletePolylines', () => { this.deletePolylines(); });
    this.app.__messageBus.on('finalizeShapes', (id) => { this.drawEnd(id); });
  }

  getGradeable() {
    return this.state
      .filter((spline) => spline.length > 1)
      .map((spline) => ({
        spline: splineData(spline).map((point) => [point.x, point.y]),
        tag: spline[0].tag,
      }));
  }

  addPolyline(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deletePolylines() {
    if (this.delIndices.length !== 0) {
      this.delIndices.sort();
      for (let i = this.delIndices.length - 1; i >= 0; i--) {
        this.state.splice(this.delIndices[i], 1);
      }
      this.delIndices.length = 0;
      this.render();
    }
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the line segment shape
  initDraw(event) {
    const currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    // We already have at least one polyline defined, add new points to the last one
    if (this.state.length > 0) {
      // Only add tag to first point
      if (this.hasTag && this.state[this.state.length - 1].length === 0) {
        currentPosition.tag = this.tag.value;
      }
      this.state[this.state.length - 1].push(currentPosition);
    } else { // Create our first polyline
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
    let len;
    // To signal that a polyline has been completed, push an empty array except when
    // associated plugin button is clicked or undo/redo
    if (id !== this.id && id !== 'undo' && id !== 'redo' &&
        this.state.length > 0 && this.state[this.state.length - 1].length > 0) {
      // Remove any dangling point for a polyline or polygon
      // Remove any line segment for a polygon
      len = this.state[this.state.length - 1].length;
      if ((!this.params.closed && len < 2) || (this.params.closed && len < 3)) {
        this.state.pop();
      }
      this.state.push([]);
      this.app.addUndoPoint();
    }
    this.render();
  }

  polylineStrokeWidth(index) {
    return index === this.state.length - 1 ? '3px' : '2px';
  }

  pointRadius(polylineIndex) {
    return this.state[polylineIndex].length === 1 ? 4 : 8;
  }

  pointOpacity(polylineIndex) {
    return this.state[polylineIndex].length === 1 ? '' : 0;
  }

  render() {
    z.render(this.el,
      z.each(this.state, (polyline, polylineIndex) =>
        // Draw visible polyline under invisible polyline
          // eslint-disable-next-line prefer-template, no-useless-concat
          z('path.visible-' + polylineIndex + '.polyline' + '.plugin-id-' + this.id, {
            d: polylinePathData(this.state[polylineIndex], this.params.closed),
            style: `
                stroke: ${this.params.color};
                stroke-width: ${this.polylineStrokeWidth(polylineIndex)};
                stroke-dasharray: ${this.computeDashArray(this.params.dashStyle, this.polylineStrokeWidth(polylineIndex))};
                fill: ${this.params.fillColor};
                opacity: ${this.params.opacity};
              `,
          }),

      ),
      z.each(this.state, (polyline, polylineIndex) =>
        // Draw invisible and selectable polyline under invisible points
        // eslint-disable-next-line prefer-template
        z('path.invisible-' + polylineIndex + this.readOnlyClass(), {
          d: polylinePathData(this.state[polylineIndex], this.params.closed),
          style: `
              stroke: ${this.params.color};
              stroke-width: 10px;
              fill: ${this.params.fillColor};
              opacity: 0;
            `,
          onmount: (el) => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({ dx, dy }) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[polylineIndex]) {
                  pt.x += dx;
                  pt.y += dy;
                }
                this.render();
              },
              inBoundsX: (dx) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[polylineIndex]) {
                  if (!this.inBoundsX(pt.x + dx)) {
                    return false;
                  }
                }
                return true;
              },
              inBoundsY: (dy) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[polylineIndex]) {
                  if (!this.inBoundsY(pt.y + dy)) {
                    return false;
                  }
                }
                return true;
              },
            });
          },
        }),
      ),
      z.each(this.state, (polyline, polylineIndex) =>
        // Draw invisible (when length of polyline > 1) and selectable points
        z.each(polyline, (pt, ptIndex) =>
          // eslint-disable-next-line prefer-template
          z('circle.invisible-' + polylineIndex + this.readOnlyClass(), {
            cx: this.state[polylineIndex][ptIndex].x,
            cy: this.state[polylineIndex][ptIndex].y,
            r: this.pointRadius(polylineIndex),
            style: `
              fill: ${this.params.color};
              stroke-width: 0;
              opacity: ${this.pointOpacity(polylineIndex)};
            `,
            onmount: (el) => {
              this.app.registerElement({
                ownerID: this.params.id,
                element: el,
                initialBehavior: 'none',
                onDrag: ({ dx, dy }) => {
                  this.state[polylineIndex][ptIndex].x += dx;
                  this.state[polylineIndex][ptIndex].y += dy;
                  this.render();
                },
                inBoundsX: (dx) => this.inBoundsX(this.state[polylineIndex][ptIndex].x + dx),
                inBoundsY: (dy) => this.inBoundsY(this.state[polylineIndex][ptIndex].y + dy),
              });
            },
          }),
        ),
      ),
      // Tags, regular or rendered by Katex
      z.each(this.state, (polyline, polylineIndex) =>
        // eslint-disable-next-line max-len
        z.if(this.hasTag && this.state[polylineIndex].length > 0 && this.state[polylineIndex][0].tag, () =>
          z(this.latex ? 'foreignObject.tag' : 'text.tag', {
            'text-anchor': (this.latex ? undefined : this.tag.align),
            x: this.state[polylineIndex][0].x + this.tag.xoffset,
            y: this.state[polylineIndex][0].y + this.tag.yoffset,
            style: this.getStyle(),
            onmount: (el) => {
              if (this.latex) {
                this.renderKatex(el, polylineIndex, 0);
              }
              if (!this.params.readonly) {
                this.addDoubleClickEventListener(el, polylineIndex, 0);
              }
            },
            onupdate: (el) => {
              if (this.latex) {
                this.renderKatex(el, polylineIndex, 0);
              }
            },
          }, this.latex ? '' : this.state[polylineIndex][0].tag),
        ),
      ),
    );
  }

  inBoundsX(x) {
    return x >= this.bounds.xmin && x <= this.bounds.xmax;
  }

  inBoundsY(y) {
    return y >= this.bounds.ymin && y <= this.bounds.ymax;
  }
}
