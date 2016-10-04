import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class Point extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/point/point-icon.svg',
      alt: 'Point tool'
    };
    super(params, app);
    // Message listeners
    this.app.__messageBus.on('addPoint', (id, index) => {this.addPoint(id, index)});
    this.app.__messageBus.on('deletePoints', () => {this.deletePoints()});
  }

  getGradeable() {
    return this.state.map(point => {
      return {
        point: [point.x, point.y]
      };
    });
  }

  addPoint(id, index) {
    if (this.id == id) {
      this.delIndices.push(index);
    }
  }

  deletePoints() {
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
  // selected the point shape
  initDraw(event) {
    this.currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    this.state.push(this.currentPosition);
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, (position, positionIndex) =>
        z('circle.point' + '.plugin-id-' + this.id  + '.state-index-' + positionIndex, {
          cx: position.x,
          cy: position.y,
          r: this.params.size / 2,
          style: `
            fill: ${this.params.color};
            stroke-width: 0;
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
