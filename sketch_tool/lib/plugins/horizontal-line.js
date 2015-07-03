import z from 'sketch2/zdom';

export const VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

export default class HorizontalLine {
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

    app.registerToolbarItem({
      type: 'button',
      id: params.id,
      label: params.label,
      icon: {
        src: './plugins/horizontal-line/icon.svg',
        alt: 'Horizontal line tool',
      },
      activate: this.activate.bind(this),
      deactivate: this.deactivate.bind(this),
    });
  }

  bindEventHandlers() {
    ['drawStart', 'drawMove', 'drawEnd']
      .forEach(name => this[name] = this[name].bind(this));
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
    window.addEventListener('pointermove', this.drawMove);
    window.addEventListener('pointerup', this.drawEnd);
    window.addEventListener('pointercancel', this.drawEnd);
    this.drawMove(event);
  }

  drawMove(event) {
    this.currentLocation = clamp(event.pageY - this.app.top, 0, this.app.height);
    this.render();
  }

  // TODO: this adds state event when pointer was cancelled. add a drawCancel method?
  drawEnd(event) {
    window.removeEventListener('pointermove', this.drawMove);
    window.removeEventListener('pointerup', this.drawEnd);
    window.removeEventListener('pointercancel', this.drawEnd);
    this.state.push(this.currentLocation);
    this.currentLocation = undefined;
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, location =>
        z('line', {
          x1: 0,
          y1: location,
          x2: this.app.width,
          y2: location,
          style: `
            stroke: ${this.params.color};
            stroke-width: 2px;
            stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
          `,
        })
      ),
      // TODO: eliminate code duplication
      z.if(this.currentLocation !== undefined, () =>
        z('line', {
          x1: 0,
          y1: this.currentLocation,
          x2: this.app.width,
          y2: this.currentLocation,
          style: `
            stroke: ${this.params.color};
            stroke-width: 2px;
            stroke-dasharray: ${computeDashArray(this.params.dashStyle)};
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
