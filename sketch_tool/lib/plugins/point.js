import z from 'sketch2/util/zdom';
import BasePlugin from './base-plugin';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class Point extends BasePlugin {
  constructor(params, app) {
    // Add params that are specific to this plugin
    params.icon = {
      src: './plugins/point/GOOGLE_ic_gps_fixed_24px.svg',
      alt: 'Point tool'
    };
    super(params, app);
  }

  getGradeable() {
    return this.state.map(point => {
      return {
        point: [point.x, point.y]
      };
    });
  }

  // This will be called when clicking on the SVG canvas after having
  // selected the point shape
  initDraw(event) {
    this.currentPosition = {
      x: event.clientX - this.params.left,
      y: event.clientY - this.params.top,
    };
    this.state.push(this.currentPosition);
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, position =>
        z('circle', {
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
              initialBehavior: 'drag',
              onDrag: ({dx, dy}) => {
                /// BUG: TODO!!!!: the position object changes when we undo/redo...
                position.x += dx;
                position.y += dy;
                this.render();
              },
              inBoundsX: (dx) => {
                return this.inBoundsX(position.x + dx);
              },
              inBoundsY: (dy) => {
                return this.inBoundsY(position.y + dy)
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
