import './polyfills';

export default class SketchInput {
  constructor(el) {
    if (!(el instanceof HTMLElement)) throw new TypeError(
      'The first argument to the SketchInput constructor must be an HTMLElement'
    );

    this.el = el;

    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas" touch-action="none"></svg>
    `;
  }
}
