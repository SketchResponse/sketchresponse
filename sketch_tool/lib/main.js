
export default class SketchInput {
  constructor(el) {
    this.el = el;

    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas"></svg>
    `;
  }
}
