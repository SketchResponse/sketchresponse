import katex from 'katex';
import Swal from 'sweetalert2';
import { getElementsByClassName } from '../util/ms-polyfills';
import colorIcon from '../util/color-icon';
import deepCopy from '../util/deep-copy';

export const VERSION = '0.1';

export default class BasePlugin {
  constructor(params, app) {
    this.params = deepCopy(params);
    this.app = app;
    this.bounds = {
      xmin: 0,
      xmax: this.params.width,
      ymin: 0,
      ymax: this.params.height
    }

    this.el = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    app.svg.appendChild(this.el);

    this.state = [];
    this.delIndices = [];
    this.readonly = this.params.readonly;

    if(!this.readonly) {
      this.bindEventHandlers();
    }

    this.id = this.params.id;

    // Tag related
    this.hasTag = this.params.tag !== undefined && this.params.tag !== null;
    if (this.hasTag) {
      this.tag = this.params.tag;
      // A tag object that gets here has a valid value for any of its defined key
      // as it has been checked by config-validator
      // So we only check for the existence of a key and fill out defaults if necessary
      this.tag.value = this.tag.value ? this.tag.value : 'tag';
      this.tag.xoffset = this.tag.xoffset ? this.tag.xoffset : 0;
      this.tag.yoffset = this.tag.yoffset ? this.tag.yoffset : 0;
      this.tag.align = this.tag.align ? this.tag.align : 'left';
      this.latex = this.tag.latex ? this.tag.latex : false;
    }
    this.selectMode = false;
    this.app.__messageBus.on('enableSelectMode', () => this.setSelectMode(true));
    this.app.__messageBus.on('disableSelectMode', () => this.setSelectMode(false));

    app.registerState({
      id: this.params.id,
      dataVersion: this.params.version,
      getState: () => this.state,
      setState: state => { this.state = state; this.render(); },
    });

    app.registerGradeable({
      id: this.params.id,
      version: this.params.gradeableVersion,
      getGradeable: () => this.getGradeable(),
    });
    // Only add a button to toolbar is the plugin is not readonly
    if (!this.readonly) {
      // Most icons look better if only fill is  used.
      // Stroke and fill are needed for polyline plugin.
      let strokeColor = 'none';
      let fillColor = 'none';
      // Closed polyline
      if (this.params.fillColor  && this.params.fillColor !== 'none') {
        strokeColor = this.params.icon.color;
        fillColor = this.params.icon.fillColor;
      }
      // Other plugins except stamp
      else if (this.params.icon.color) {
        fillColor = this.params.icon.color;
      }
      const icon = {
        src: this.params.icon.src,
        alt: this.params.icon.alt,
      }
      // Do not color stamp icon as it would require an XHR with its potential SOP issues
      if (this.params.name !== 'stamp') {
        icon.src = colorIcon(icon.src, strokeColor, fillColor);
      }
      this.menuItem = {
        type: 'button',
        id: this.params.id,
        name: this.params.name,
        label: this.params.label,
        icon: icon,
        color: this.params.color ? this.params.color : 'black',
        activate: this.activate.bind(this),
        deactivate: this.deactivate.bind(this)
      };
      if (!this.params.isSubItem) {
        app.registerToolbarItem(this.menuItem);
      }
      // Double click/tap related
      this.oldTime = Date.now();
    }
    /*
      Check if all the methods that must be implemented in extended classes are
      present
    */
   ['getGradeable', 'initDraw', 'render', 'inBoundsX', 'inBoundsY']
    .forEach(fnStr => {
      if (!(typeof this[fnStr] === 'function')) {
        throw new TypeError(this.getTypeErrorStr(fnStr));
      }
    });

    Object.defineProperty(this.params, 'left', {
      get: () => { return this.app.svg.getBoundingClientRect().left; }
    });

    Object.defineProperty(this.params, 'top', {
      get: () => { return this.app.svg.getBoundingClientRect().top; }
    });
  }

  static generateDefaultParams(defaultParams, params) {
    const keys = [
      'id', 'name', 'width', 'height', 'xrange', 'yrange', 'xscale', 'yscale', 'coordinates'];
    const allDefaultParams = deepCopy(defaultParams);
    for (const key of keys) {
      allDefaultParams[key] = params[key];
    }
    if (params.isSubItem) {
      allDefaultParams.isSubItem = true;
    }
    return allDefaultParams;
  }

  bindEventHandlers() {
    // TODO: simplify if we end up with only one entry
    ['initDraw']
      .forEach(name => this[name] = this[name].bind(this));
  }

  getTypeErrorStr(method) {
    return `You must implement the ${method} method in a class extending
           BasePlugin`;
  }

  activate() {
    this.app.__messageBus.emit('disableSelectMode');
    this.app.svg.addEventListener('pointerdown', this.initDraw);
    this.app.svg.style.cursor = 'crosshair';
  }

  deactivate() {
    this.app.svg.removeEventListener('pointerdown', this.initDraw);
    this.app.svg.style.cursor = 'default';
  }

  clampX(x) {
    if (x < this.bounds.xmin) {
      return this.bounds.xmin;
    }
    else if (x > this.bounds.xmax) {
      return this.bounds.xmax
    }
    else {
      return x;
    }
  }

  clampY(y) {
    if (y < this.bounds.ymin) {
      return this.bounds.ymin;
    }
    else if (y > this.bounds.ymax) {
      return this.bounds.ymax
    }
    else {
      return y;
    }
  }

  readOnlyClass() {
    return this.readonly ? '.readonly' : '';
  }

  // Tag related
  setSelectMode(selectMode) {
    this.selectMode = selectMode;
    this.render(); // To change tag cursor
  }

  getTagCursor() {
    return this.params.readonly ? 'default' : (this.selectMode ? 'pointer' : 'crosshair');
  }

  getStyle() {
    return this.latex ?
      `
        color: #333;
        font-size: 14px;
        cursor: ${this.getTagCursor()};
        overflow: visible;
      ` :
      `
        fill: #333;
        font-size: 14px;
        cursor: ${this.getTagCursor()};
      `
  }

  renderKatex(el, index1, index2) {
    let stateEl = this.state[index1];
    // Needed for freeform, polyline, and spline plugins
    if (typeof index2 !== 'undefined') {
      stateEl = this.state[index1][index2];
    }
    try {
      // The foreignObject containing the Katex rendering needs an initial width and height.
      el.setAttributeNS(null, 'width', '100%');
      el.setAttributeNS(null, 'height', '100%');
      katex.render(stateEl.tag, el, {
        errorColor: '#0000ff'
      });
      // Set the foreignObject bounding box to match the Katex rendering
      this.adjustBoundingBox(el);
    }
    catch(e) {
      katex.render('\\text{\\color{red}{Error: invalid markup}}', el, {
        errorColor: '#0000ff'
      });
      this.adjustBoundingBox(el);
    }
  }

  // We do not have a dblclick event for touch devices and have to implement one using pointerdown
  addDoubleClickEventListener(el, index1, index2) {
    el.addEventListener('pointerdown', () => {
      const newTime = Date.now();
      const deltaT = newTime - this.oldTime;
      this.oldTime = newTime;
      // Double click/tap
      if (deltaT <= 1000) {
        if (this.selectMode) {
          let stateEl = this.state[index1];
          // Needed for freeform, polyline, and spline plugins
          if (typeof index2 !== 'undefined') {
            stateEl = this.state[index1][index2];
          }
          Swal.fire({
            title: 'Enter tag value',
            input: 'text',
            inputValue: stateEl.tag,
            showCancelButton: true,
            inputValidator: (val) => {
              val.trim();
              return new Promise(resolve => {
                if (val === '') {
                  resolve('Tag value is an empty string');
                } else if (val === stateEl.tag) {
                  resolve('Tag value has not been changed');
                }
                else  {
                  stateEl.tag = val;
                  this.app.addUndoPoint();
                  this.render();
                  resolve();
                }
              });
            },
          });
        }
      }
    });
  }

  adjustBoundingBox(el) {
    let bRect = getElementsByClassName(el, 'katex-html')[0].getBoundingClientRect();
    el.setAttributeNS(null, 'width', bRect.width.toString());
    el.setAttributeNS(null, 'height', bRect.height.toString());
  }

  computeDashArray(dashStyle, strokeWidth) {
    let scale = Math.pow(strokeWidth, 0.6); // seems about right perceptually
    switch (dashStyle) {
      case 'dashed': return 5*scale + ',' + 3*scale;
      case 'longdashed': return 10*scale + ',' + 3*scale;
      case 'dotted': return 2*scale + ',' + 2*scale;
      case 'dashdotted': return 7*scale + ',' + 3*scale + ',' + 1.5*scale + ',' + 3*scale;
      // 'solid' or anything else
      default: return 'none';
    }
  }
}
