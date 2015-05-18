function _implementsZNodeInterface(obj) {
  return obj &&
    typeof obj.mount === 'function' &&
    typeof obj.unmount === 'function' &&
    typeof obj.update === 'function';
}

class ZNodeCollection {
  constructor(...nodes) {
    this.nodes = nodes.map(child => {
      if (_implementsZNodeInterface(child)) return child;

      // Note: if this is not a zNode, coerce value to text:
      return new ZTextNode(String(child));
    });
  }

  mount(parentEl, refEl) {
    this.nodes.forEach(child => child.mount(parentEl, refEl));
  }

  unmount(cleanupDOM) {
    this.nodes.forEach(child => child.unmount(cleanupDOM));
  }

  update(zNodeCollection, refEl) {
    this.nodes.forEach((child, i) => {
      let internalRefEl = refEl;

      // Try to find an earlier reference sibling in our own nodes
      for (let refIndex = i + 1; refIndex < this.nodes.length; refIndex++) {
        if (this.nodes[refIndex].el) {
          internalRefEl = this.nodes[refIndex].el;
          break;
        }
      }

      child.update(zNodeCollection.nodes[i], internalRefEl);
    });
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

  update(zNode) {
    if (zNode.text !== this.text) {
      this.el.nodeValue = zNode.text;
      this.text = zNode.text;
    }
  }
}


class ZElement {
  constructor(tagName, props, ...children) {
    this.tagName = tagName;
    this.props = props || {};
    this.childCollection = new ZNodeCollection(...children);
    /* this.el = undefined; */
  }

  mount(parentEl, refEl) {
    this.el = document.createElement(this.tagName);
    this._syncDOMProps({}, this.props);
    this.childCollection.mount(this.el);
    parentEl.insertBefore(this.el, refEl || null);  // null inserts as last child
  }

  unmount(cleanupDOM) {
    if (cleanupDOM) this.el.parentNode.removeChild(this.el);
    this.childCollection.unmount(false);  // Note: we've already cleaned up DOM elements for them
    delete this.el;
  }

  update(zNode, refEl) {
    this._syncDOMProps(this.props, zNode.props);
    this.props = zNode.props;
    this.childCollection.update(zNode.childCollection, refEl);
  }

  _syncDOMProps(oldProps, newProps) {
    // create & update
    Object.keys(newProps)
      .filter(propName => oldProps[propName] !== newProps[propName])
      .forEach(propName => {
        if (propName.slice(0,2) === 'on') {
          // Handle event listeners since we can't set them with setAttribute
          this.el[propName] = newProps[propName];
          return;
        }
        this.el.setAttribute(propName, newProps[propName]);
      });

    // delete
    Object.keys(oldProps)
      .filter(propName => !newProps.hasOwnProperty(propName))
      .forEach(propName => {
        if (propName.slice(0,2) === 'on') {
          // Remove an event listener
          this.el[propName] = null;
          return;
        }
        this.el.removeAttribute(propName);
      });
  }
}


class ZIf {
  constructor(condition, ...children) {
    this.truthy = !!condition;
    this.childCollection = new ZNodeCollection(...children);
    /* this.parentEl = undefined; */
  }

  mount(parentEl, refEl) {
    if (this.truthy) this.childCollection.mount(parentEl, refEl);
    this.parentEl = parentEl;
  }

  unmount(cleanupDOM) {
    this.childCollection.unmount(cleanupDOM);
    delete this.parentEl;
  }

  update(zNode, refEl) {
    if (this.truthy && zNode.truthy) {
      this.childCollection.update(zNode.childCollection, refEl);
    }
    else if (!this.truthy && zNode.truthy) {
      this.childCollection.mount(this.parentEl, refEl);
      this.truthy = true;
    }
    else if (this.truthy && !zNode.truthy) {
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

  mount(parentEl, refEl) {
    this.childCollection.mount(parentEl, refEl);
  }

  unmount(cleanupDOM) {
    this.childCollection.unmount(cleanupDOM);
  }

  update(zNode, refEl) {
    this.childCollection.update(zNode.childCollection, refEl);
    // TODO: Add support for entering or exiting children,
    // making sure to issue DOM cleanups as needed
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
