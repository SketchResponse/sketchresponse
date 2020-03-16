import deepExtend from 'deep-extend';
import z from '../util/zdom';
import BasePlugin from './base-plugin';
import fitCurve from './freeform/fitcurve';
import validate from '../config-validator';
import splineSvg from './spline/spline-icon.svg';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

const FIT_TOLERANCE = 0;
const ROUNDING_PRESCALER = 100;

const DEFAULT_PARAMS = {
  label: 'Spline',
  color: 'dimgray',
};

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

function splinePathData(points) {
  if (points.length < 2) return '';

  const coords = splineData(points).map((p) => `${p.x},${p.y}`);
  return `M${ coords[0] }C${ coords.splice(1).join(' ') }`;
}

export default class Spline extends BasePlugin {
  constructor(params, app) {
    const sParams = BasePlugin.generateDefaultParams(DEFAULT_PARAMS, params);
    if (!app.debug || validate(params, 'spline')) {
      deepExtend(sParams, params);
    } else {
      // eslint-disable-next-line no-console
      console.log('The spline config has errors, using default values instead');
    }
    const iconSrc = splineSvg;
    // Add params that are specific to this plugin
    sParams.icon = {
      src: iconSrc,
      alt: 'Spline tool',
      color: sParams.color,
    };
    // Add versions
    sParams.version = VERSION;
    sParams.gradeableVersion = GRADEABLE_VERSION;
    super(sParams, app);
    // Message listeners
    this.app.__messageBus.on('addSpline', (id, index) => { this.addSpline(id, index); });
    this.app.__messageBus.on('deleteSplines', () => { this.deleteSplines(); });
    this.app.__messageBus.on('finalizeShapes', (id) => { this.drawEnd(id); });
  }

  getGradeable() {
    // Do not take in account single points
    const result = this.state.filter((spline) => spline.length >= 2);
    // State contains arrays of points of user clicks.
    // Convert these to spline data.
    return result.map((spline) => ({
      spline: splineData(spline).map((point) => [point.x, point.y]),
      tag: spline[0].tag,
    }));
  }

  addSpline(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteSplines() {
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
    // We already have at least one spline defined, add new points to the last one
    if (this.state.length > 0) {
      // Only add tag to first point
      if (this.hasTag && this.state[this.state.length - 1].length === 0) {
        currentPosition.tag = this.tag.value;
      }
      this.state[this.state.length - 1].push(currentPosition);
    } else { // Create our first spline
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
    // To signal that a spline has been completed, push an empty array except when
    // associated plugin button is clicked or undo/redo
    if (id !== this.id && id !== 'undo' && id !== 'redo' &&
        this.state.length > 0 && this.state[this.state.length - 1].length > 0) {
      // Remove any dangling point
      if (this.state[this.state.length - 1].length < 2) {
        this.state.pop();
      }
      this.state.push([]);
      this.app.addUndoPoint();
    }
    this.render();
  }

  splineStrokeWidth(index) {
    return index === this.state.length - 1 ? '3px' : '2px';
  }

  render() {
    z.render(this.el,
      // Draw visible elements under invisible elements
      z.each(this.state, (spline, splineIndex) =>
        // Draw spline
        // eslint-disable-next-line prefer-template, no-useless-concat
        z('path.visible-' + splineIndex + '.spline' + '.plugin-id-' + this.id, {
          d: splinePathData(this.state[splineIndex]),
          style: `
              stroke: ${this.params.color};
              stroke-width: ${this.splineStrokeWidth(splineIndex)};
              stroke-dasharray: ${this.computeDashArray(this.params.dashStyle, this.splineStrokeWidth(splineIndex))};
              fill: none;
            `,
        }),
      ),
      // Draw points
      z.each(this.state, (spline, splineIndex) =>
        z.each(spline, (pt, ptIndex) =>
          // eslint-disable-next-line prefer-template, no-useless-concat
          z('circle.visible-' + splineIndex + '.spline' + '.plugin-id-' + this.id, {
            cx: this.state[splineIndex][ptIndex].x,
            cy: this.state[splineIndex][ptIndex].y,
            r: 3,
            style: `
              fill: ${this.params.color};
              stroke: none;
            `,
          }),
        ),
      ),
      z.each(this.state, (spline, splineIndex) =>
        // Draw invisible and selectable spline under invisible points
        // eslint-disable-next-line prefer-template
        z('path.invisible-' + splineIndex + this.readOnlyClass(), {
          d: splinePathData(this.state[splineIndex]),
          style: `
              stroke: ${this.params.color};
              stroke-width: 10px;
              fill: none;
              opacity: 0;
            `,
          onmount: (el) => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({ dx, dy }) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[splineIndex]) {
                  pt.x += dx;
                  pt.y += dy;
                }
                this.render();
              },
              inBoundsX: (dx) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[splineIndex]) {
                  if (!this.inBoundsX(pt.x + dx)) {
                    return false;
                  }
                }
                return true;
              },
              inBoundsY: (dy) => {
                // eslint-disable-next-line no-restricted-syntax
                for (const pt of this.state[splineIndex]) {
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
      z.each(this.state, (spline, splineIndex) =>
        // Draw invisible and selectable points
        z.each(spline, (pt, ptIndex) =>
          // eslint-disable-next-line prefer-template
          z('circle.invisible-' + splineIndex + this.readOnlyClass(), {
            cx: this.state[splineIndex][ptIndex].x,
            cy: this.state[splineIndex][ptIndex].y,
            r: 8,
            style: `
              fill: ${this.params.color};
              stroke-width: 0;
              opacity: 0;
            `,
            onmount: (el) => {
              this.app.registerElement({
                ownerID: this.params.id,
                element: el,
                initialBehavior: 'none',
                onDrag: ({ dx, dy }) => {
                  this.state[splineIndex][ptIndex].x += dx;
                  this.state[splineIndex][ptIndex].y += dy;
                  this.render();
                },
                inBoundsX: (dx) => this.inBoundsX(this.state[splineIndex][ptIndex].x + dx),
                inBoundsY: (dy) => this.inBoundsY(this.state[splineIndex][ptIndex].y + dy),
              });
            },
          }),
        ),
      ),
      // Tags, regular or rendered by Katex
      z.each(this.state, (spline, splineIndex) =>
        // eslint-disable-next-line max-len
        z.if(this.hasTag && this.state[splineIndex].length > 0 && this.state[splineIndex][0].tag, () =>
          z(this.latex ? 'foreignObject.tag' : 'text.tag', {
            'text-anchor': (this.latex ? undefined : this.tag.align),
            x: this.state[splineIndex][0].x + this.tag.xoffset,
            y: this.state[splineIndex][0].y + this.tag.yoffset,
            style: this.getStyle(),
            onmount: (el) => {
              if (this.latex) {
                this.renderKatex(el, splineIndex, 0);
              }
              if (!this.params.readonly) {
                this.addDoubleClickEventListener(el, splineIndex, 0);
              }
            },
            onupdate: (el) => {
              if (this.latex) {
                this.renderKatex(el, splineIndex, 0);
              }
            },
          }, this.latex ? '' : this.state[splineIndex][0].tag),
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
