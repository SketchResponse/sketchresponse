import z from 'sketch2/zdom';

export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

export default class VerticalLine {
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
        src: './plugins/vertical-line/icon.svg',
        alt: 'Vertical line tool',
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
    const yvals = [
      0,
      Math.round(this.params.height / 3),
      Math.round(2 * this.params.height / 3),
      this.params.height,
    ];

    return this.state.map(x => {
      return {
        spline: yvals.map(y => [x, y]),
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
    this.currentLocation = clamp(event.pageX - this.params.left, 0, this.params.width);
    this.render();
  }

  // TODO: this adds state event when pointer was cancelled. add a drawCancel method?
  drawEnd(event) {
    this.app.svg.releasePointerCapture(event.pointerId);
    this.app.svg.removeEventListener('pointermove', this.drawMove);
    this.app.svg.removeEventListener('pointerup', this.drawEnd);
    this.app.svg.removeEventListener('pointercancel', this.drawEnd);
    this.state.push(this.currentLocation);
    this.currentLocation = undefined;
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, location =>
        z('line', {
          x1: location,
          y1: 0,
          x2: location,
          y2: this.params.height,
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
          x1: this.currentLocation,
          y1: 0,
          x2: this.currentLocation,
          y2: this.params.height,
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
