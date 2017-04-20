import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';
export const DEFAULTS = {
  width: 100,
  height: 100,
  scale: 1
};

export default class Stamp extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: params.iconsSrc ? params.iconSrc : './plugins/stamp/stamp-icon.svg',
      alt: 'Stamp tool'
    };
    super(params, app);
    this.src = params.src ? params.src : './plugins/stamp/stamp.svg';
    this.scale = (params.scale !== undefined) ? params.scale : DEFAULTS.scale;
    this.width = (params.imgwidth !== undefined) ? params.imgwidth : DEFAULTS.width;
    this.height = (params.imgheight !== undefined) ? params.imgheight : DEFAULTS.height;
    // Message listeners
    this.app.__messageBus.on('addStamp', (id, index) => {this.addStamp(id, index)});
    this.app.__messageBus.on('deleteStamps', () => {this.deleteStamps()});
    ['drawMove', 'drawEnd'].forEach(name => this[name] = this[name].bind(this));
  }

  getGradeable() {
    return this.state.map(point => {
      return {
        point: [point.x, point.y]
      };
    });
  }

  addStamp(id, index) {
    if (this.id === id) {
      this.delIndices.push(index);
    }
  }

  deleteStamps() {
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

  // We first scale our image.
  // Then translate so that the image is centered on mouse click.
  getTransform(x, y) {
    let xt = x - 0.5*this.scale*this.width,
        yt = y - 0.5*this.scale*this.height;
    return `translate(${xt}, ${yt}) scale(${this.scale})`;
  }

  render() {
    z.render(this.el,
      z.each(this.state, (position, positionIndex) =>
        z('image.stamp' + '.plugin-id-' + this.id  + '.state-index-' + positionIndex, {
          x: 0,
          y: 0,
          width: this.width,
          height: this.height,
          transform: this.getTransform(position.x, position.y),
          'xlink:href': this.src,
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
      )
    );
  }

  inBoundsX(x) {
    return x>= this.bounds.xmin && x <= this.bounds.xmax;
  }

  inBoundsY(y) {
    return y  >= this.bounds.ymin && y <= this.bounds.ymax;
  }
}
