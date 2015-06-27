import './polyfills';
import Toolbar from './toolbar';

export default class SketchInput {
  constructor(el, toolbarItems) {
    if (!(el instanceof HTMLElement)) throw new TypeError(
      'The first argument to the SketchInput constructor must be an HTMLElement'
    );

    this.el = el;

    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas" touch-action="none"></svg>
    `;

    if (toolbarItems) {
      this.toolbar = new Toolbar(document.getElementById('si-toolbar'), this, toolbarItems);
    }
  }

  dispatch(type, id, subId) {
    // TODO: don't hard-code this... perhaps refactor toolbar events to be internal?
    this.toolbar.handleEvent({type, id, subId});
  }
}
