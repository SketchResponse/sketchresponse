import deepExtend from 'deep-extend';
import { validate } from '../config-validator';

export const DEFAULT_PARAMS = {
  scale: 1,
  align: '',
  offset: [0, 0],
  src: '', // Put a default image?
};

export default class Image {
  constructor(params, app) {
    this.params = DEFAULT_PARAMS;
    if (!app.debug || validate(params, 'image')) {
      deepExtend(this.params, params);
    }
    const scale = this.params.scale;
    const align = this.params.align; // Note: params.align.toLowerCase() was removed
    const offset = this.params.offset;

    const x = (offset[0] / 100 + (
      (align.match('left')) ? 0 :
      (align.match('right')) ? (1 - scale) :
      0.5 * (1 - scale)
    )) / scale;

    const y = (-offset[1] / 100 + (  // Sign is flipped so positive y offsets move image upward
      (align.match('top')) ? 0 :
      (align.match('bottom')) ? (1 - scale) :
      0.5 * (1 - scale)
    )) / scale;

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', this.params.src);
    this.el.setAttributeNS(null, 'x', `${x * 100}%`);
    this.el.setAttributeNS(null, 'y', `${y * 100}%`);
    this.el.setAttributeNS(null, 'width', '100%');
    this.el.setAttributeNS(null, 'height', '100%');
    this.el.setAttributeNS(null, 'transform', `scale(${scale})`);
    app.svg.appendChild(this.el);
  }
}
