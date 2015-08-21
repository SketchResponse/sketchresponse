const SCALING_TYPES = {
  fit: 'xMidYMid meet',
  fill: 'xMidYMid slice',
  stretch: 'none',
};

export default class Background {
  constructor(params, app) {
    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', params.src);
    this.el.setAttributeNS(null, 'width', '100%');
    this.el.setAttributeNS(null, 'height', '100%');
    this.el.setAttributeNS(null, 'preserveAspectRatio', SCALING_TYPES[params.scaling] || SCALING_TYPES['fill']);
    app.svg.appendChild(this.el);
  }
}
