import './util/polyfills';
import { createInheritingObjectTree } from './util/inheriting-object-tree';
import { disableDoubleTapZoom, preventClickDelay } from './util/workarounds';

import { EventEmitter } from 'events';
import KeyMaster from 'keymaster';

import NotificationManager from './notification-manager';
import GradeableManager from './gradeable-manager';
import StateManager from './state-manager';
import HistoryManager from './history-manager';
import ElementManager from './element-manager';
import {validate} from './config-validator';
import deepCopy from 'sketch/util/deep-copy';
import deepExtend from 'deep-extend';

import Toolbar from './toolbar';


import * as attrCache from './util/dom-attr-cache';

const DEFAULT_CONFIG = {
  width: 750,
  height: 420,
  xrange: [-4.5, 4.5],
  yrange: [-2.5, 2.5],
  xscale: 'linear',
  yscale: 'linear',
  coordinates: 'cartesian'
}


export default class SketchInput {
  constructor(el, config) {
    if (!(el instanceof HTMLElement)) throw new TypeError(
      'The first argument to the SketchInput constructor must be an HTMLElement'
    );

    this.el = el;
    if (config.initialstate) {
      this.initialState = deepCopy(config.initialstate);
      delete config.initialstate;
    }
    // Check if we are in debug mode
    this.debug = typeof config.debug === 'boolean' ? config.debug : false;
    // Load default config
    this.config = DEFAULT_CONFIG;
    // If in debug mode, validate config except plugins array entries that will be validated by each plugin
    // If we are not in debug mode or have a valid config, overwrite default keys/values
    if (!this.debug || validate(config, 'main')) {
      deepExtend(this.config, config);
    }
    // Otherwise use default values and add plugins array to the config
    else {
      this.config.plugins = deepExtend(config.plugins);
      console.log('The main config has errors, using default values instead');
    }
    this.params = createInheritingObjectTree(this.config);
    this.messageBus = new EventEmitter();
    this.oldTime = Date.now();
    this.oldPt = {
      x: 0,
      y: 0
    }

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
            <h1>SketchResponse</h1>
            <p class="si-copyright">
              Copyright (c) 2015-2016 Massachusetts Institute of Technology.
            </p>
          </header>
          <p>
            SketchResponse is an open-source graphical input and assessment tool for online learning
            platforms. The code and documentation for this project (including instructions for course authors wishing to
            create their own sketch problems) are freely available at
            <a href="https://github.com/SketchResponse/sketchresponse" target="_blank">github.com/SketchResponse</a>.
            We welcome collaborators and are open to any feedback you may have!
          </p>
          <p>
            This library is free software; you can redistribute it and/or modify it under the terms of the GNU Lesser
            General Public License as published by the Free Software Foundation. Please see our <a href="LICENSE.txt"
            target="_blank">LICENSE file</a> for complete license terms.
          </p>
          <p>
            SketchResponse also uses third-party code and creative-commons licensed content which are distributed under
            their own license terms; details may be found in the LICENSE file linked above.
          </p>
        </div>
      </div>
    `;

    // Workaround for iOS Safari and Chrome (the latter supports the touch-action CSS property, but let's
    // keep everything the same for now). TODO: remove if implemented in PEP or WebKit.
    disableDoubleTapZoom(this.el);

    // Prevent click delay on touch devices. TODO: remove when handled by CSS touch-action or PEP.
    preventClickDelay(this.el);

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
    this.stateManager = new StateManager(this.config, this.messageBus, this.initialState);
    this.historyManager = new HistoryManager(this.config, this.messageBus, this.stateManager);

    this.app = {
      registerState: entry => this.messageBus.emit('registerState', entry),
      registerGradeable: entry => this.messageBus.emit('registerGradeable', entry),
      registerToolbarItem: entry => this.messageBus.emit('registerToolbarItem', entry),
      addUndoPoint: () => this.messageBus.emit('addUndoPoint'),
      __messageBus: this.messageBus,
      svg: document.getElementById('si-canvas'),
      debug: this.debug
    }

    // Prevent default on dragstart to keep Firefox from dragging the SVG
    // setting capture to true to get the event as soon as possible
    // NOTE: Cannot use mousedown here since that also prevents mouse move/up
    // from being captured when the mouse leaves the window/iframe (in Chrome at least)
    this.app.svg.addEventListener('dragstart', event => event.preventDefault(), true);

    this.toolbar = new Toolbar(this.params, this.app);
    this.elementManager = new ElementManager(this.app);
    this.app.registerElement = this.elementManager.registerElement.bind(this.elementManager);

    // Disable multiple pointerdown events if the events are close together in time and distance:
    // Less than 500 ms and less than 5 px.
    // Double clicks are still enabled though when they happen on a label element.
    document.addEventListener('pointerdown', event => {
      let newTime = Date.now(),
          deltaT = newTime - this.oldTime,
          newPt = {
            x: event.clientX,
            y: event.clientY
          },
          dist = Math.sqrt(
            (newPt.x - this.oldPt.x)*(newPt.x - this.oldPt.x) +
            (newPt.y - this.oldPt.y)*(newPt.y - this.oldPt.y)
          );
      if (deltaT < 500 && dist < 5) {
        event.stopPropagation();
      }
      this.oldTime = newTime;
      this.oldPt.x = newPt.x;
      this.oldPt.y = newPt.y;
    }, true);

    // Add stateful buttons (Select and plugins) to the left of the toolbar
    this.app.registerToolbarItem({
      type: 'button',
      id: 'select',
      label: 'Select',
      icon: {
        src: './lib/select-icon.svg',
        stroke: 'none',
        fill: 'black',
        alt: 'Select',
      },
      color: 'black',
      activate: () => {
        // Temporarily hold a reference for ulterior removal
        this.handlePointerDown = () => {
          this.messageBus.emit('deselectAll');
        }
        this.app.svg.addEventListener('pointerdown', this.handlePointerDown);
        this.app.svg.style.cursor = 'default';
      },
      deactivate: () => {
        this.app.svg.removeEventListener('pointerdown', this.handlePointerDown);
        // Remove the temporary reference
        delete this['handlePointerDown'];
      },
      action: () => {
        this.messageBus.emit('enableSelectMode');
        this.messageBus.emit('activateItem', 'select');
      }
    });

    plugins.forEach((Plugin, idx) => {
      new Plugin(this.params.plugins[idx], this.app);
    });

    document.addEventListener('pointerdown', () => this.messageBus.emit('closeDropdown'), true);

    // Add action buttons (Delete, Undo, and Redo) to the right of the toolbar
    // TODO: factor into... something
    this.app.registerToolbarItem({type: 'separator'});
    this.app.registerToolbarItem({
      type: 'button',
      id: 'delete',
      label: 'Delete',
      icon: {
        src: './lib/delete-icon.svg',
        stroke: 'none',
        fill: 'black',
        alt: 'Delete',
      },
      action: () => this.messageBus.emit('deleteSelected'),
    });
    this.app.registerToolbarItem({
      type: 'button',
      id: 'undo',
      label: 'Undo',
      icon: {
        src: './lib/undo-icon.svg',
        stroke: 'none',
        fill: 'black',
        alt: 'Undo',
      },
      action: () => this.messageBus.emit('undo'),
    });
    this.app.registerToolbarItem({
      type: 'button',
      id: 'redo',
      label: 'Redo',
      icon: {
        src: './lib/redo-icon.svg',
        stroke: 'none',
        fill: 'black',
        alt: 'Redo',
      },
      action: () => this.messageBus.emit('redo'),
    });

    this.messageBus.emit('activateItem',
      this.params.plugins.find(pluginSpec => pluginSpec.id !== undefined).id
    );

    // Global keyboard shortcuts (TODO: move elsewhere?)
    /*
      Initially, MouseTrap was used here: https://www.npmjs.com/package/mousetrap
      But its Apache version 2 license is incompatible except if were to be linked dynamically which
      is not possible here.
      We use KeyMaster instead and its MIT license:
      https://www.npmjs.com/package/keymaster

      NOTE:
      MouseTrap uses KeyboardEvent.which:
      https://github.com/ccampbell/mousetrap/blob/master/mousetrap.js

      KeyMaster uses KeyboardEvent.keyCode:
      https://github.com/madrobby/keymaster/blob/master/keymaster.js

      that are deprecated (as KeyboardEvent.char and KeyboardEvent.charCode):
      https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent

      KeyboardEvent.key is recommended and a polyfill exists:
      https://www.npmjs.com/package/keyboardevent-key-polyfill
    */

    KeyMaster('⌘+z, ctrl+z', event => { this.messageBus.emit('undo'); return false; });
    KeyMaster('⌘+y, ctrl+y, ⌘+shift+z, ctrl+shift+z', event => { this.messageBus.emit('redo'); return false; });
    KeyMaster('esc', event => { this.messageBus.emit('deselectAll'); return false; });
    KeyMaster('delete, backspace', event => { this.messageBus.emit('deleteSelected'); return false; });
    KeyMaster('enter', event => { this.messageBus.emit('finalizeShapes'); return false; });
    document.addEventListener('mouseenter', event => window.focus());  // So we get keyboard events. Rethink this?

    // Allow multitouch zoom on SVG element (TODO: move elsewhere?)
    this.app.svg.addEventListener('touchstart', event => {
      if (event.touches.length > 1) this.app.svg.setAttribute('touch-action', 'auto');
    }, true);

    this.app.svg.addEventListener('touchend', event => {
      if (event.touches.length == 0) this.app.svg.setAttribute('touch-action', 'none');
    }, true);

    this.messageBus.on('deleteFinished', () => {this.app.addUndoPoint();});
    //////////// TEMPORARY TEST CODE FOR ELEMENT MANAGER //////////////

    // {
    //   const svg = document.getElementById('si-canvas')
    //   const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    //   attrCache.setAttributeNS(circle, null, 'cx', 150);
    //   attrCache.setAttributeNS(circle, null, 'cy', 150);
    //   attrCache.setAttributeNS(circle, null, 'r', 9);
    //   attrCache.setAttributeNS(circle, null, 'style', 'fill: orange;');
    //   svg.appendChild(circle);

    //   this.elementManager.registerElement({
    //     ownerID: 'f',
    //     element: circle,
    //     onDrag: ({dx, dy}) => {
    //       const x = Number(attrCache.getAttributeNS(circle, null, 'cx'));
    //       const y = Number(attrCache.getAttributeNS(circle, null, 'cy'));
    //       attrCache.setAttributeNS(circle, null, 'cx', x + dx);
    //       attrCache.setAttributeNS(circle, null, 'cy', y + dy);
    //     },
    //   });
    // }

    //////////// END TEMPORARY TEST CODE FOR ELEMENT MANAGER //////////////
    if (this.initialState) {
      this.messageBus.emit('loadInitialState');
    }
    else {
      this.messageBus.emit('ready');
    }
  }

  setState(state) { return this.stateManager.setState(state); }
  getState() { return this.stateManager.getState(); }
  getGradeable() { return this.gradeableManager.getGradeable(); }
}
