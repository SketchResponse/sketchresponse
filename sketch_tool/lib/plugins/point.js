import deepExtend from 'deep-extend';
import z from '../util/zdom';
import BasePlugin from './base-plugin';
import { validate } from '../config-validator';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

const DEFAULT_PARAMS = {
  label: 'Point',
  color: 'dimgray',
  size: 15,
  hollow: false,
};

export default class Point extends BasePlugin {
  constructor(params, app) {
    const pParams = BasePlugin.generateDefaultParams(DEFAULT_PARAMS, params);
    if (!app.debug || validate(params, 'point')) {
      deepExtend(pParams, params);
    } else {
      // eslint-disable-next-line no-console
      console.log('The point config has errors, using default values instead');
    }
    // Add params that are specific to this plugin
    const iconSrc = pParams.hollow ? './lib/plugins/point/point-hollow-icon.svg'
                             : './lib/plugins/point/point-icon.svg';
    pParams.icon = {
      src: iconSrc,
      alt: 'Point tool',
      color: pParams.color,
    };
    // Add versions
    pParams.version = VERSION;
    pParams.gradeableVersion = GRADEABLE_VERSION;
    super(pParams, app);
    this.strokeWidth = pParams.hollow ? 2 : 0;
    this.fillOpacity = pParams.hollow ? 0 : 1;
    // Given a params.size, to have identical visible radiuses in both cases, we need to shrink
    // the hollow point to take in account the 2px width of the stroke
    this.radius = pParams.hollow ? (pParams.size / 2) - 1 : pParams.size / 2;
    // Message listeners
    this.app.__messageBus.on('addPoint', (id, index) => this.addPoint(id, index));
    this.app.__messageBus.on('deletePoints', () => this.deletePoints());
    ['drawMove', 'drawEnd'].forEach((name) => {
      this[name] = this[name].bind(this);
    });
  }

  getGradeable() {
    return this.state.map((position) => ({
      point: [position.x, position.y],
      tag: position.tag,
    }));
  }

  addPoint(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deletePoints() {
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
  // selected the point shape
  initDraw(event) {
    // Add event listeners in capture phase
    document.addEventListener('pointermove', this.drawMove, true);
    document.addEventListener('pointerup', this.drawEnd, true);
    document.addEventListener('pointercancel', this.drawEnd, true);
    this.currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    if (this.hasTag) {
      this.currentPosition.tag = this.tag.value;
    }
    this.state.push(this.currentPosition);
    this.render();
  }

  drawMove(event) {
    let x = event.clientX - this.params.left;
    let y = event.clientY - this.params.top;
    const lastPosition = this.state[this.state.length - 1];

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

  render() {
    z.render(this.el,
      z.each(this.state, (position, positionIndex) =>
        // eslint-disable-next-line prefer-template, no-useless-concat
        z('circle.point' + '.plugin-id-' + this.id + '.state-index-' + positionIndex + this.readOnlyClass(), {
          cx: position.x,
          cy: position.y,
          r: this.radius,
          style: `
            fill: ${this.params.color};
            fill-opacity: ${this.fillOpacity};
            stroke: ${this.params.color};
            stroke-width: ${this.strokeWidth};
          `,
          onmount: (el) => {
            this.app.registerElement({
              ownerID: this.params.id,
              element: el,
              initialBehavior: 'none',
              onDrag: ({ dx, dy }) => {
                this.state[positionIndex].x += dx;
                this.state[positionIndex].y += dy;
                this.render();
              },
              inBoundsX: (dx) => this.inBoundsX(this.state[positionIndex].x + dx),
              inBoundsY: (dy) => this.inBoundsY(this.state[positionIndex].y + dy),
            });
          },
        }),
      ),
      // Tags, regular or rendered by Katex
      z.each(this.state, (position, positionIndex) =>
        z.if(this.hasTag, () =>
          z(this.latex ? 'foreignObject.tag' : 'text.tag', {
            'text-anchor': (this.latex ? undefined : this.tag.align),
            x: position.x + this.tag.xoffset,
            y: position.y + this.tag.yoffset,
            style: this.getStyle(),
            onmount: (el) => {
              if (this.latex) {
                this.renderKatex(el, positionIndex);
              }
              if (!this.params.readonly) {
                this.addDoubleClickEventListener(el, positionIndex);
              }
            },
            onupdate: (el) => {
              if (this.latex) {
                this.renderKatex(el, positionIndex);
              }
            },
          }, this.latex ? '' : this.state[positionIndex].tag),
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
