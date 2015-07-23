import './polyfills';

import { EventEmitter } from 'events';
import Mousetrap from 'mousetrap';

import NotificationManager from './notification-manager';
import GradeableManager from './gradeable-manager';
import StateManager from './state-manager';
import HistoryManager from './history-manager';

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
    this.messageBus = new EventEmitter();

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
        Made with <span aria-label="love">&hearts;</span> at MIT | <a id="si-show-help-legal" href="#">Info & Legal</a>
      </div>
      <div id="si-help-legal" data-visible="false">
        <div role="dialog" class="si-dialog">
          <header>
            <h1>SketchInput</h1>
            <p class="si-copyright">
              Copyright 2015 Massachusetts Institute of Technology. All rights Reserved.
            </p>
          </header>
          <p>
            SketchInput is an extensible graphical input and assessment tool for online learning platforms.
            It is very much a work in progress; we welcome your feedback and ideas at
            <a href="mailto:sketchinput-feedback@mit.edu">sketchinput-feedback@mit.edu</a>.
            The source code for this project will likely be available under an open-source license in the near future.
            If you are interested in updates, please let us know!
          </p>
          <p>
            This software contains open-source, third-party code and creative-commons licensed content (for which
            we are grateful). These are distributed under the terms of their own licenses, which are included
            in the <a href="LICENSE.txt" target="_blank">LICENSE file</a> provided with this project.
          </p>
        </div>
      </div>
    `;

    const showHelpLegal = document.getElementById('si-show-help-legal');
    const helpLegal = document.getElementById('si-help-legal');
    const helpLegalDialog = document.querySelector('#si-help-legal .si-dialog');  // TODO: fix ugly hack...

    showHelpLegal.addEventListener('click', event => {
      event.preventDefault();
      helpLegal.setAttribute('data-visible', 'true');
    });

    helpLegal.addEventListener('click', event => helpLegal.setAttribute('data-visible', 'false'));
    helpLegalDialog.addEventListener('click', event => event.stopPropagation());

    this.notificationManager = new NotificationManager(this.config, this.messageBus);
    this.gradeableManager = new GradeableManager(this.config, this.messageBus);
    this.stateManager = new StateManager(this.config, this.messageBus);
    this.historyManager = new HistoryManager(this.config, this.messageBus, this.stateManager);

    this.app = {
      registerState: entry => this.messageBus.emit('registerState', entry),
      registerGradeable: entry => this.messageBus.emit('registerGradeable', entry),
      registerToolbarItem: entry => this.messageBus.emit('registerToolbarItem', entry),
      addUndoPoint: () => this.messageBus.emit('addUndoPoint'),
      __messageBus: this.messageBus,
      svg: document.getElementById('si-canvas'),
    }

    // Prevent default on mousedown to keep Firefox from dragging the SVG
    // setting capture to true to get the event as soon as possible
    this.app.svg.addEventListener('mousedown', event => event.preventDefault(), true);

    Object.defineProperty(this.params, 'left', {
      get: () => { return this.app.svg.getBoundingClientRect().left + window.pageXOffset; }
    });

    Object.defineProperty(this.params, 'top', {
      get: () => { return this.app.svg.getBoundingClientRect().top + window.pageYOffset; }
    });

    this.toolbar = new Toolbar(this.params, this.app);

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


    this.messageBus.emit('activateItem',
      this.params.plugins.find(pluginSpec => pluginSpec.id !== undefined).id
    );

    // Global keyboard shortcuts (TODO: move elsewhere?)
    Mousetrap.bind('mod+z', event => { this.messageBus.emit('undo'); return false; });
    Mousetrap.bind(['mod+y', 'mod+shift+z'], event => { this.messageBus.emit('redo'); return false; });
    document.addEventListener('mouseenter', event => window.focus());  // So we get keyboard events. Rethink this?

    // Allow multitouch zoom on SVG element (TODO: move elsewhere?)
    this.app.svg.addEventListener('touchstart', event => {
      if (event.touches.length > 1) this.app.svg.setAttribute('touch-action', 'auto');
    }, true);

    this.app.svg.addEventListener('touchend', event => {
      if (event.touches.length == 0) this.app.svg.setAttribute('touch-action', 'none');
    }, true);

    this.messageBus.emit('ready');
  }

  setState(state) { return this.stateManager.setState(state); }
  getState() { return this.stateManager.getState(); }
  getGradeable() { return this.gradeableManager.getGradeable(); }
}
