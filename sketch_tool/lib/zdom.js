function _implementsZNodeInterface(obj) {
  return obj &&
    typeof obj.mount === 'function' &&
    typeof obj.unmount === 'function' &&
    typeof obj.update === 'function';
}

class ZNodeCollection {
  constructor(...nodes) {
    this.nodes = nodes.map(node => {
      if (_implementsZNodeInterface(node)) return node;

      // Note: if this is not a zNode, coerce value to text:
      return new ZTextNode(String(node));
    });

    this.keys = this.nodes.map((node, i) =>
      (node.props && (node.props.keys || node.props.id)) || i
    );

    /* this.parentEl = undefined; */
  }

  get el() { return this.nodes[0] && this.nodes[0].el; }

  mount(parentEl, refEl) {
    this.nodes.forEach(node => node.mount(parentEl, refEl));
    this.parentEl = parentEl;
  }

  unmount(cleanupDOM) {
    this.nodes.forEach(node => node.unmount(cleanupDOM));
    delete this.parentEl;
  }

  update(next, refEl) {
    const updatedNodes = [];

    // delete
    for (let oldIdx = this.keys.length - 1; oldIdx >= 0; --oldIdx) {
      if (next.keys.indexOf(this.keys[oldIdx]) === -1) {
        this.nodes[oldIdx].unmount(true);
        this.nodes.splice(oldIdx, 1);
        this.keys.splice(oldIdx, 1);
      }
    }

    // create & update
    // TODO: document this...
    for (let node, oldIdx, newIdx = next.keys.length - 1; newIdx >= 0; --newIdx) {
      oldIdx = this.keys.indexOf(next.keys[newIdx]);
      if (oldIdx >= 0) {
        // old node exists; update it now
        node = this.nodes[oldIdx];
        node.update(next.nodes[newIdx], refEl);
      }
      else {
        // mount the new node
        node = next.nodes[newIdx];
        node.mount(this.parentEl, refEl);
      }
      refEl = node.el || refEl;
      updatedNodes.unshift(node);
    }

    this.nodes = updatedNodes;
    this.keys = next.keys;
  }
}


class ZTextNode {
  constructor(text) {
    this.text = text;
    /* this.el = undefined; */
  }

  mount(parentEl, refEl) {
    this.el = document.createTextNode(this.text);
    parentEl.insertBefore(this.el, refEl || null);
  }

  unmount(cleanupDOM) {
    if (cleanupDOM) this.el.parentNode.removeChild(this.el);
  }

  update(next) {
    if (this.text !== next.text) {
      this.el.nodeValue = next.text;
      this.text = next.text;
    }
  }
}


const NAMESPACE_MAP = {
  xmlns: 'http://www.w3.org/2000/xmlns/',
  xhtml: 'http://www.w3.org/1999/xhtml',
  xlink: 'http://www.w3.org/1999/xlink',
  svg: 'http://www.w3.org/2000/svg',
  ev: 'http://www.w3.org/2001/xml-events',
}

function _qualify(name) {
  const [nsPrefix, localName] = name.split(':');
  if (localName == undefined || !NAMESPACE_MAP.hasOwnProperty(nsPrefix)) {
    return {namespaceURI: null, localName: name};
  }
  return {namespaceURI: NAMESPACE_MAP[nsPrefix], localName: localName};
}


class ZElement {
  constructor(tagName, props, ...children) {
    this.tagName = tagName;
    this.props = props || {};
    this.childCollection = new ZNodeCollection(...children);
    /* this.el = undefined; */
  }

  mount(parentEl, refEl) {
    const {namespaceURI, localName} = _qualify(this.tagName);

    // Note: namespaceURI is inherited from the parent unless it's explicitly given
    this.el = document.createElementNS(namespaceURI || parentEl.namespaceURI, localName);
    this._syncDOMProps({}, this.props);
    this.childCollection.mount(this.el);
    parentEl.insertBefore(this.el, refEl || null);  // null inserts as last child
  }

  unmount(cleanupDOM) {
    if (cleanupDOM) this.el.parentNode.removeChild(this.el);
    this.childCollection.unmount(false);  // Note: we've already cleaned up DOM elements for them
    delete this.el;
  }

  update(next, refEl) {
    this._syncDOMProps(this.props, next.props);
    this.props = next.props;
    this.childCollection.update(next.childCollection, refEl);
  }

  _syncDOMProps(oldProps, newProps) {
    // create & update
    Object.keys(newProps)
      .filter(propName => oldProps[propName] !== newProps[propName])
      .forEach(propName => {
        const {namespaceURI, localName} = _qualify(propName);
        if (localName.slice(0,2) === 'on' && namespaceURI === null) {
          // Handle event listeners since we can't set them with setAttribute
          this.el[localName] = newProps[localName];
          return;
        }
        // Note: the choice of the `propName` (which may have a prefix) as the second argument to
        // setAttributeNS instead of `localName` (no prefix) is based on the recommendation at
        // https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course
        this.el.setAttributeNS(namespaceURI, propName, newProps[propName]);
      });

    // delete
    Object.keys(oldProps)
      .filter(propName => !newProps.hasOwnProperty(propName))
      .forEach(propName => {
        const {namespaceURI, localName} = _qualify(propName);
        if (localName.slice(0,2) === 'on' && namespaceURI === null) {
          // Remove an event listener
          this.el[localName] = null;
          return;
        }
        this.el.removeAttributeNS(namespaceURI, localName);
      });
  }
}


class ZIf {
  constructor(condition, ...children) {
    this.truthy = !!condition;
    this.childCollection = new ZNodeCollection(...children);
    /* this.parentEl = undefined; */
  }

  get el() { return this.childCollection.el; }

  mount(parentEl, refEl) {
    if (this.truthy) this.childCollection.mount(parentEl, refEl);
    this.parentEl = parentEl;
  }

  unmount(cleanupDOM) {
    this.childCollection.unmount(cleanupDOM);
    delete this.parentEl;
  }

  update(next, refEl) {
    if (this.truthy && next.truthy) {
      this.childCollection.update(next.childCollection, refEl);
    }
    else if (!this.truthy && next.truthy) {
      next.childCollection.mount(this.parentEl, refEl);
      this.childCollection = next.childCollection;
      this.truthy = true;
    }
    else if (this.truthy && !next.truthy) {
      this.childCollection.unmount(true);  // Note: make children clean up own DOM elements
      this.truthy = false;
    }
  }
}


class ZEach {
  constructor(items, callback) {
    this.items = items || [];
    this.callback = callback;
    this.childCollection = new ZNodeCollection(...this.items.map(this.callback));
  }

  get el() { return this.childCollection.el; }

  mount(parentEl, refEl) {
    this.childCollection.mount(parentEl, refEl);
  }

  unmount(cleanupDOM) {
    this.childCollection.unmount(cleanupDOM);
  }

  update(next, refEl) {
    this.childCollection.update(next.childCollection, refEl);
  }
}


function z(tagName, props, ...children) {
  props = props || {};
  if (typeof props === 'string' || _implementsZNodeInterface(props)) {
    // this is actually the first child, not the props object
    children.unshift(props);
    props = {};
  }

  if (tagName.indexOf('#') !== -1) {
    props.id = props.id || tagName  // explicit props.id gets priority
      .match(/#[^.#]+/)[0]
      .slice(1);  // remove leading '#'
    tagName = tagName.replace(/#[^.#]+/g, '');  // remove id(s) from tagName
  }

  if (tagName.indexOf('.') !== -1) {
    props.class = tagName
      .match(/\.[^.#]+/g)
      .map(str => str.slice(1))  // remove leading dots
      .concat(props.class || '')  // add additional classes, if any
      .join(' ')
      .trim();
    tagName = tagName.replace(/\.[^.#]+/g, '');  // remove classes from tagName
  }

  // Automatically add SVG namespace
  if (tagName === 'svg') tagName = 'svg:svg';

  tagName = tagName || 'div'; // default tag is a div
  return new ZElement(tagName, props, ...children);
}

z.if = function z_if(...args) { return new ZIf(...args); };
z.each = function z_each(...args) { return new ZEach(...args); };

z.render = function z_render(targetEl, ...children) {
  const zRoot = new ZNodeCollection(...children);
  if (!targetEl.__zRoot__) {
    // mount
    zRoot.mount(targetEl);
    targetEl.__zRoot__ = zRoot;
  }
  else {
    // update
    targetEl.__zRoot__.update(zRoot);
  }
};

export default z;
