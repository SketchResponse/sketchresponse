import Toolbar from './toolbar';

export default class SketchInput {
  constructor(el, toolbarItems) {
    this.el = el;

    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas"></svg>
    `;

    if (toolbarItems) {
      this.toolbar = new Toolbar(document.getElementById('si-toolbar'), this, toolbarItems);
    }
  }
}
