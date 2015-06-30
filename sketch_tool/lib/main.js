import './polyfills';

import events from 'events';
let EventEmitter = events.EventEmitter; // TODO: remove after upgrading to SystemJS > 0.17

import NotificationManager from './notification-manager';
import GradeableManager from './gradeable-manager';
import StateManager from './state-manager';
import Toolbar from './toolbar';

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
      __messageBus: this.messageBus,
    }

    this.toolbar = new Toolbar(this.config, this.app);

    window.si = this; // For debugging
  }

  setState(state) { return this.stateManager.setState(state); }
  getState() { return this.stateManager.getState(); }
  getGradeable() { return this.gradeableManager.getGradeable(); }
}
