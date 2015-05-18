function _implementsZNodeInterface(obj) {
  return obj &&
    typeof obj.mount === 'function' &&
    typeof obj.unmount === 'function' &&
    typeof obj.update === 'function';
}

class ZNodeCollection {
  constructor(...nodes) {
    // Coerce any non-zNodes to text
    this.nodes = nodes.map(node =>
      _implementsZNodeInterface(node) ? node : new ZTextNode(String(node))
    );

    // Assign keys with precedence props.key > props.id > index
    this.keys = this.nodes.map((node, i) =>
      node.props && (node.props.key || node.props.id) || i
    );

    /* this.parentEl = undefined; */
  }

  // Return our first node's element when asked for our 'el'; this is sometimes used to find a
  // reference node for 'insertBefore' (e.g., as in our own update method below).
  // TODO: this is a bit hacky; refactor?
  get el() {
    return this.nodes[0] && this.nodes[0].el;
  }

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


function z(tagName, props, ...children) {
  props = props || {};
  if (typeof props === 'string' || _implementsZNodeInterface(props)) {
    // this is actually the first child, not the props object
    children.unshift(props);
    props = {};
  }

  // Hyperscript: handle ID (unless props.id already exists)
  if (tagName.indexOf('#') >= 0 && !props.id) {
    props.id = tagName
      .match(/#[^.#]+/)[0]  // first match only
      .slice(1);  // remove leading '#'
  }

  // Hyperscript: handle classes
  if (tagName.indexOf('.') >= 0) {
    props.class = tagName
      .match(/\.[^.#]+/g)
      .map(str => str.slice(1))  // remove leading dots
      .concat(props.class || '')  // add additional classes, if any
      .join(' ')
      .trim();
  }

  // Hyperscript: extract tag name (including any namespace prefix) or default to 'div'
  tagName = tagName.match(/^[^.#]*/)[0] || 'div';

  // Automatically add SVG namespace
  if (tagName === 'svg') tagName = 'svg:svg';

  return new ZElement(tagName, props, ...children);
}

z.if = function z_if(condition, ...children) {
  return condition ? new ZNodeCollection(...children) : new ZNodeCollection();
};

z.each = function z_each(items=[], callback) {
  return new ZNodeCollection(...items.map(callback));
};

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
