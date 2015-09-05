export const DEFAULTS = {
  scale: 1,
  align: '',
  offset: [0, 0],
};

export default class Image {
  constructor(params, app) {
    const scale = (params.scale !== undefined) ? params.scale : DEFAULTS.scale;
    const align = (params.align !== undefined) ? params.align.toLowerCase() : DEFAULTS.align;
    const offset = params.offset || DEFAULTS.offset;

    const x = (offset[0] / 100 + (
      (align.match('left')) ? 0 :
      (align.match('right')) ? (1 - scale) :
      0.5 * (1 - scale)
    )) / scale;

    const y = (offset[1] / 100 + (
      (align.match('top')) ? 0 :
      (align.match('bottom')) ? (1 - scale) :
      0.5 * (1 - scale)
    )) / scale;

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', params.src);
    this.el.setAttributeNS(null, 'x', `${x * 100}%`);
    this.el.setAttributeNS(null, 'y', `${y * 100}%`);
    this.el.setAttributeNS(null, 'width', '100%');
    this.el.setAttributeNS(null, 'height', '100%');
    this.el.setAttributeNS(null, 'style', `transform: scale(${scale});`);
    app.svg.appendChild(this.el);
  }
}
