import z from 'sketch2/zdom';
import fitCurve from './freeform/fitcurve';

export const VERSION = '0.1';

// TODO: move some of these into 'params.defaults'?
const FIT_TOLERANCE = 5;
const RUBBER_BAND_LENGTH = 25;
const MIN_POINT_SPACING = 3;
const MAX_POINT_SPACING = 3;
const ROUNDING_PRESCALER = 100;  // e.g., Math.round(value * ROUNDING_PRESCALER) / ROUNDING_PRESCALER

export default class Freeform {
  constructor(params, app) {
    this.params = params;
    this.app = app;

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.appendChild(this.el);

    this.pointsBeingDrawn = [];
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
        src: './plugins/freeform/GOOGLE_ic_create_24px.svg',
        alt: 'Freeform tool',
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
    this.app.svg.setPointerCapture(event.pointerId);
    this.app.svg.addEventListener('pointermove', this.drawMove);
    this.app.svg.addEventListener('pointerup', this.drawEnd);
    this.app.svg.addEventListener('pointercancel', this.drawEnd);
    this.lastPoint = this.pointerPosition = {
      x: event.pageX - this.app.left,
      y: event.pageY - this.app.top,
    };
    this.pointsBeingDrawn.push(this.lastPoint);
  }

  drawMove(event) {
    this.pointerPosition = {
      x: event.pageX - this.app.left,
      y: event.pageY - this.app.top,
    };

    let pointerDistance = Math.sqrt(
      Math.pow(this.pointerPosition.x - this.lastPoint.x, 2) +
      Math.pow(this.pointerPosition.y - this.lastPoint.y, 2)
    );

    let drawDirection;

    while (pointerDistance >= MIN_POINT_SPACING + RUBBER_BAND_LENGTH) {
      // Only compute drawDirection once per drawMove call since it won't change until the next drawMove
      drawDirection = drawDirection || direction(subtract(this.pointerPosition, this.lastPoint));

      const drawDistance = clamp(
        pointerDistance - RUBBER_BAND_LENGTH,
        MIN_POINT_SPACING,
        MAX_POINT_SPACING
      );

      const nextPoint = add(this.lastPoint, scale(drawDirection, drawDistance));
      this.pointsBeingDrawn.push(nextPoint);

      this.lastPoint = nextPoint;
      pointerDistance -= drawDistance;
    }

    this.render();
  }

  drawEnd(event) {
    this.app.svg.removeEventListener('pointermove', this.drawMove);
    this.app.svg.removeEventListener('pointerup', this.drawEnd);
    this.app.svg.removeEventListener('pointercancel', this.drawEnd);
    this.app.svg.releasePointerCapture(event.pointerId);
    this.lastPoint = null;
    this.pointerPosition = null;

    if (this.pointsBeingDrawn.length >= 2) {
      const splineData = fitCurve(this.pointsBeingDrawn, FIT_TOLERANCE);
      splineData.forEach(point => {
        point.x = Math.round(ROUNDING_PRESCALER * point.x) / ROUNDING_PRESCALER;
        point.y = Math.round(ROUNDING_PRESCALER * point.y) / ROUNDING_PRESCALER;
      });
      this.state.push(splineData);
    }
    this.pointsBeingDrawn = [];
    this.app.addUndoPoint();
    this.render();
  }

  render() {
    z.render(this.el,
      z.each(this.state, spline =>
        z('path', {
          d: cubicSplinePathData(spline),
          style: `stroke: ${this.params.color}; stroke-width: 3px; fill: none;`,
        })
      ),
      z('path', {
        d: polylinePathData(this.pointsBeingDrawn),
        style: `stroke: ${this.params.color}; stroke-width: 3px; fill: none; opacity: 0.7;`,
      }),
      z.if(this.lastPoint && this.pointerPosition, () =>
        z('line', {
          x1: this.lastPoint.x,
          y1: this.lastPoint.y,
          x2: this.pointerPosition.x,
          y2: this.pointerPosition.y,
          style: 'stroke: lightgray; stroke-width: 2px',
        })
      )
    );
  }
}

function polylinePathData(points) {
  if (points.length < 2) return '';

  const coords = points.map(p => `${p.x},${p.y}`);
  return `M${ coords[0] }L${ coords.splice(1).join(' ') }`;
}

function cubicSplinePathData(points) {
  if (points.length < 4) return '';

  const coords = points.map(p => `${p.x},${p.y}`);
  return `M${ coords[0] }C${ coords.splice(1).join(' ') }`;
}

function clamp(value, min, max) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function lerp(point1, point2, t) {
  return {
    x: t * point1.x + (1-t) * point2.x,
    y: t * point1.y + (1-t) * point2.y,
  };
}

function add(point1, point2) {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y,
  }
}

function subtract(point1, point2) {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y,
  };
}

function scale(point, factor) {
  return {
    x: point.x * factor,
    y: point.y * factor,
  };
}

function direction(point) {
  const magnitude = Math.sqrt(point.x * point.x + point.y * point.y);
  return {
    x: point.x / magnitude,
    y: point.y / magnitude,
  };
}
