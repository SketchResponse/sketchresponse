function _implementsZNodeInterface(obj) {
  return obj &&
    typeof obj.mount === 'function' &&
    typeof obj.unmount === 'function' &&
    typeof obj.update === 'function';
}

class ZNodeCollection {
  constructor(...children) {
    this.children = children.map(child => {
      if (_implementsZNodeInterface(child)) return child;

      // Note: if this is not a zNode, coerce value to text (via the browser):
      return new ZTextNode(child);
    });
  }

  mount(parentEl, refEl) {
    this.children.forEach(child => child.mount(parentEl, refEl));
  }

  unmount(cleanupDOM) {
    this.children.forEach(child => child.unmount(cleanupDOM));
  }

  update(zNode, refEl) {
    this.children.forEach((child, i) => {
      let internalRefEl = refEl;

      // Try to find an earlier reference sibling in our own children
      for (let refIndex = i + 1; refIndex < this.children.length; refIndex++) {
        if (this.children[refIndex].el) {
          internalRefEl = this.children[refIndex].el;
          break;
        }
      }

      child.update(zNode.childCollection.children[i], internalRefEl);
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
    this.childCollection.update(zNode, refEl);
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
      this.childCollection.update(zNode, refEl);
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
    this.childCollection.update(zNode, refEl);
    // TODO: Add support for entering or exiting children,
    // making sure to issue DOM cleanups as needed
  }
}


function z(...args) { return new ZElement(...args); }

z.if = function z_if(...args) { return new ZIf(...args); };
z.each = function z_each(...args) { return new ZEach(...args); };

z.render = function z_render(targetEl, ...children) {
  const zRoot = new ZElement('z-root', null, ...children);
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
