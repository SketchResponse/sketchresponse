import './polyfills';

import { EventEmitter } from 'events';

import NotificationManager from './notification-manager';
import GradeableManager from './gradeable-manager';
import StateManager from './state-manager';
import Toolbar from './toolbar';

function createInheritingObjectTree(oldObj, parent=Object.prototype) {
  const typeString = Object.prototype.toString.call(oldObj);

  if (typeString === '[object Object]') {
    // oldObj is a plain(ish) javascript object; make an inheriting variant and recurse
    const newObj = Object.create(parent);
    Object.keys(oldObj).forEach(key => {
      newObj[key] = createInheritingObjectTree(oldObj[key], newObj);
    });
    return newObj;
  }
  else if (typeString === '[object Array]') {
    // oldObj is an array; map it to an array with items inheriting from last known parent object
    return oldObj.map(item => createInheritingObjectTree(item, parent));
  }
  else {
    // oldObj is something else (primitive, Map, etc.); copy it without any inheritance
    return oldObj;
  }
}

export default class SketchInput {
  constructor(el, config) {
    if (!(el instanceof HTMLElement)) throw new TypeError(
      'The first argument to the SketchInput constructor must be an HTMLElement'
    );

    this.el = el;
    this.config = config;
    this.params = createInheritingObjectTree(config);

    Promise.all(
      this.params.plugins.map(pluginParams =>
        System.import(`plugins/${pluginParams.name}`).then(module => module.default)
      )
    ).then(plugins => this.init(plugins));
  }

  init(plugins) {
    // NOTE: transparent rectangle seems necessary for touch events to work on iOS Safari;
    // this may be related to https://bugs.webkit.org/show_bug.cgi?id=135628. TODO: remove when fixed.
    this.el.innerHTML = `
      <menu id="si-toolbar"></menu>
      <svg id="si-canvas" touch-action="none" width="${this.config.width}" height="${this.config.height}">
        <rect width="100%" height="100%" fill="transparent" />
      </svg>
      <div id="si-attribution">
        Made with <span aria-label="love">&hearts;</span> at MIT | <a id="si-show-help-legal" href="#">Help & Legal</a>
      </div>
    `;

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

    // Helpers: TODO: move elsewhere...
    const {width, height, left, top} = this.app.svg.getBoundingClientRect();
    this.app.width = width;
    this.app.height = height;
    this.app.left = left + window.pageXOffset;  // Translate to page coordinates
    this.app.top = top + window.pageYOffset;


    plugins.forEach((Plugin, idx) => {
      new Plugin(this.params.plugins[idx], this.app);
    });

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
