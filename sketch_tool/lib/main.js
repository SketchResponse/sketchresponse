import './polyfills';

import { EventEmitter } from 'events';

import NotificationManager from './notification-manager';
import GradeableManager from './gradeable-manager';
import StateManager from './state-manager';
import Toolbar from './toolbar';

import Axes from './plugins/axes';
import Point from './plugins/point';
import Freeform from './plugins/freeform';
import VerticalLine from './plugins/vertical-line';
import HorizontalLine from './plugins/horizontal-line';

export default class SketchInput {
  constructor(el, config) {
    if (!(el instanceof HTMLElement)) throw new TypeError(
      'The first argument to the SketchInput constructor must be an HTMLElement'
    );

    this.el = el;

    // NOTE: transparent rectangle seems necessary for touch events to work on iOS Safari;
    // this may be related to https://bugs.webkit.org/show_bug.cgi?id=135628. TODO: remove when fixed.
    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas" touch-action="none">
        <rect width="100%" height="100%" fill="transparent" />
      </svg>
      <div id="si-attribution">
        Made with <span aria-label="love">&hearts;</span> at MIT | <a id="si-show-help-legal" href="#">Help & Legal</a>
      </div>
    `;

    // Temporarily hard-code this stuff for testing:
    this.config = {};
    this.messageBus = new EventEmitter();

    const oldEmit = this.messageBus.emit;
    this.messageBus.emit = function(...args) {
      console.log('emit: ', ...args);
      oldEmit.apply(this.messageBus, args);
    }

    const oldOn = this.messageBus.on;
    this.messageBus.on = function(...args) {
      console.log('on: ', ...args);
      oldOn.apply(this.messageBus, args);
    }

    this.notificationManager = new NotificationManager(this.config, this.messageBus);
    this.gradeableManager = new GradeableManager(this.config, this.messageBus);
    this.stateManager = new StateManager(this.config, this.messageBus);

    this.app = {
      registerState: entry => this.messageBus.emit('registerState', entry),
      registerToolbarItem: entry => this.messageBus.emit('registerToolbarItem', entry),
      addUndoPoint: () => this.messageBus.emit('addUndoPoint'),
      __messageBus: this.messageBus,
      svg: document.getElementById('si-canvas'),
    }

    this.toolbar = new Toolbar(this.config, this.app);

    ////////////////////////////////////////
    new Freeform({id: 'f', label: 'Function f(x)', color: 'blue'}, this.app);
    new Freeform({id: 'g', label: 'Derivative g(x)', color: 'orange'}, this.app);
    new VerticalLine({id: 'va', label: 'Vertical asymptote', color: 'gray', dashStyle: 'dashdotted'}, this.app);
    new HorizontalLine({id: 'ha', label: 'Horizontal asymptote', color: 'gray', dashStyle: 'dashdotted'}, this.app);
    new Point({id: 'cp', label: 'Critical point', color: 'black', size: 15}, this.app);

    // Helpers: TODO: move elsewhere...
    const {width, height, left, top} = this.app.svg.getBoundingClientRect();
    this.app.width = width;
    this.app.height = height;
    this.app.left = left + window.pageXOffset;  // Translate to page coordinates
    this.app.top = top + window.pageYOffset;

    new Axes({xrange: [-4.5, 4.5], yrange: [-2.5, 2.5], xscale: 'linear', yscale: 'linear'}, this.app);


    // TODO: factor into... something
    this.app.registerToolbarItem({type: 'separator'});
    this.app.registerToolbarItem({
      type: 'button',
      id: 'undo',
      label: 'Undo',
      icon: {
        src: './lib/GOOGLE_ic_undo_24px.svg',
        alt: 'Undo',
      },
      action: () => this.messageBus.emit('undo'),
    });
    this.app.registerToolbarItem({
      type: 'button',
      id: 'redo',
      label: 'Redo',
      icon: {
        src: './lib/GOOGLE_ic_redo_24px.svg',
        alt: 'Redo',
      },
      action: () => this.messageBus.emit('redo'),
    });

    this.messageBus.emit('activateItem', 'f');

    this.messageBus.emit('addUndoPoint');
  }

  setState(state) { return this.stateManager.setState(state); }
  getState() { return this.stateManager.getState(); }
  getGradeable() { return this.gradeableManager.getGradeable(); }
}
