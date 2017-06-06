export const VERSION = '0.1';
export const GRADEABLE_VERSION = '0.1';

export default class BasePlugin {
  constructor(params, app) {
    this.params = params;
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
    this.readonly = params.readonly;

    if(!this.readonly) {
      this.bindEventHandlers();
    }

    this.id = params.id;

    // Tag related
    this.hasTag = params.tag !== undefined && params.tag !== null;
    if (this.hasTag) {
      this.tag = params.tag;
    }
    this.selectMode = false;
    this.app.__messageBus.on('enableSelectMode', () => this.setSelectMode(true));
    this.app.__messageBus.on('disableSelectMode', () => this.setSelectMode(false));

    app.registerState({
      id: params.id,
      dataVersion: VERSION,
      getState: () => this.state,
      setState: state => { this.state = state; this.render(); },
    });

    app.registerGradeable({
      id: params.id,
      version: GRADEABLE_VERSION,
      getGradeable: () => this.getGradeable(),
    });
    // Only add a button to toolbar is the plugin is not readonly
    if (!this.readonly) {
      // Most icons look better if only fill is  used.
      // Stroke and fill are needed for polyline plugin.
      let strokeColor, fillColor;
      if (params.fillColor) {
        strokeColor = params.icon.color;
        fillColor = params.icon.fillColor;
      }
      else {
        strokeColor = 'none';
        fillColor = params.icon.color;
      }
      app.registerToolbarItem({
        type: 'button',
        id: params.id,
        name: params.name,
        label: params.label,
        icon: {
          src: params.icon.src,
          alt: params.icon.alt,
          stroke: strokeColor,
          fill: fillColor
        },
        activate: this.activate.bind(this),
        deactivate: this.deactivate.bind(this),
      });
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
