import z from 'sketch2/zdom';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

export default class Point {
  constructor(params, app) {
    this.params = params;
    this.app = app;

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.appendChild(this.el);

    this.state = [];

    this.bindEventHandlers();

    app.registerState({
      id: params.id,
      dataVersion: VERSION,
      getState: () => this.state,
      setState: state => { this.state = state; this.render(); },
    });

    app.registerGradeable({
      id: params.id,
      version: GRADEABLE_VERSION,
      getGradeable: () => this.getGradeable(),
    });

    app.registerToolbarItem({
      type: 'button',
      id: params.id,
      label: params.label,
      icon: {
        src: './plugins/point/GOOGLE_ic_gps_fixed_24px.svg',
        alt: 'Point tool',
      },
      activate: this.activate.bind(this),
      deactivate: this.deactivate.bind(this),
    });
  }

  bindEventHandlers() {
    ['drawStart', 'drawMove', 'drawEnd']
      .forEach(name => this[name] = this[name].bind(this));
  }

  getGradeable() {
    return this.state.map(point => {
      return {
        point: [point.x, point.y]
      };
    });
  }

  activate() {
    this.app.svg.addEventListener('pointerdown', this.drawStart);
    this.app.svg.style.cursor = 'crosshair';
  }

  deactivate() {
    this.app.svg.removeEventListener('pointerdown', this.drawStart);
    this.app.svg.style.cursor = null;
  }

  drawStart(event) {
    this.app.svg.setPointerCapture(event.pointerId);
    this.app.svg.addEventListener('pointermove', this.drawMove);
    this.app.svg.addEventListener('pointerup', this.drawEnd);
    this.app.svg.addEventListener('pointercancel', this.drawEnd);
    this.drawMove(event);
  }

  drawMove(event) {
    this.currentPosition = {
      x: clamp(event.clientX - this.params.left, 0, this.params.width),
      y: clamp(event.clientY - this.params.top, 0, this.params.height),
    };
    this.render();
  }

  // TODO: this adds state event when pointer was cancelled. add a drawCancel method?
  drawEnd(event) {
    this.app.svg.releasePointerCapture(event.pointerId);
    this.app.svg.removeEventListener('pointermove', this.drawMove);
    this.app.svg.removeEventListener('pointerup', this.drawEnd);
    this.app.svg.removeEventListener('pointercancel', this.drawEnd);
    this.state.push(this.currentPosition);
    this.currentPosition = undefined;
    this.app.addUndoPoint();
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
        })
      ),
      // TODO: eliminate code duplication
      z.if(this.currentPosition !== undefined, () =>
        z('circle', {
          cx: this.currentPosition.x,
          cy: this.currentPosition.y,
          r: this.params.size / 2,
          style: `
            fill: ${this.params.color};
            stroke-width: 0;
            opacity: 0.7;
          `,
        })
      )
    );
  }
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}
