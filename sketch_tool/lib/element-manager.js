import PointerDownCache from './pointer-down-cache';
import SelectionManager from './selection-manager';
import DragManager from './drag-manager';
import { getElementsByClassName } from './util/ms-polyfills';

const MIN_DRAG_DISTANCE_SQUARED = 5 ** 2;

export default class ElementManager {
  constructor(app) {
    this.app = app;
    this.registry = new WeakMap();

    this.pointerDownCache = new PointerDownCache(app.svg);
    this.selectionManager = new SelectionManager(app.svg, app.__messageBus);
    this.dragManager = new DragManager(this.registry, this.selectionManager);

    // Only dealing with global (not per-pointer) dragging for now
    this.activePointerId = null;
    this.initialEvent = null;
    this.isDragging = false;

    this.bindEventHandlers();
  }

  bindEventHandlers() {
    ['onPointerDown', 'onPointerMove', 'onPointerUp']
      .forEach((name) => this[name] = this[name].bind(this));
  }

  registerElement(entry) {
    const element = entry.element;
    if (this.registry.has(element)) {
      this.registry.set(element, entry); // Just overwrite old entry
      return;
    }

    // Element is not yet registered; initialize as needed
    this.registry.set(element, entry);
    element.addEventListener('pointerdown', this.onPointerDown, false);

    if (entry.initialBehavior === 'drag') {
      // Initialize and dispatch a clone of the nearest pointerdown event
      const clientRect = element.getBoundingClientRect();
      const initialEvent = this.pointerDownCache.getNearestByClientRect(clientRect);
      const clonedEvent = new PointerEvent('pointerdown', initialEvent);
      element.dispatchEvent(clonedEvent);
    }
  }

  unregisterElement(entry) {
    const element = entry.element;
    element.removeEventListener('pointerdown', this.onPointerDown, false);
    this.registry.delete(element);
  }

  onPointerDown(event) {
    const className = event.currentTarget.getAttribute('class');
    // Readonly elements cannot be selected or dragged
    if (className.indexOf('readonly') !== -1) {
      return;
    }
    // This can only trigger when the element is active, so no need to check that again
    // We do check that (1) there isn't already an active pointer, and (2) this is a left click
    // or touch/pen equivalent (see http://www.w3.org/TR/pointerevents/#button-states)
    if (this.activePointerId !== null || event.buttons !== 1 ||
        !this.selectionManager.selectMode) return;
    event.stopPropagation();
    event.preventDefault();

    this.addCaptureAndListeners(event);
    this.activePointerId = event.pointerId;
    this.initialEvent = event;
  }

  onPointerMove(event) {
    if (event.pointerId !== this.activePointerId) return;
    event.stopPropagation();
    event.preventDefault();

    if (!this.isDragging) {
      const dx = event.clientX - this.initialEvent.clientX;
      const dy = event.clientY - this.initialEvent.clientY;
      if (dx ** 2 + dy ** 2 < MIN_DRAG_DISTANCE_SQUARED) return; // Don't consider this a drag for small distances


      // TODO: GAH: timing: this might not fire until after the corresponding pointerup...


      this.dragManager.dragStart(event.currentTarget, this.initialEvent); // Note: initialEvent has clientX/Y
      this.isDragging = true;
    }
    this.dragManager.dragMove(event);
  }

  onPointerUp(event) {
    if (event.pointerId !== this.activePointerId) return;
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget;
    const className = element.getAttribute('class');
    let visibleElements;
    if (className && className.substring(0, 9) === 'invisible') {
      const classNamePrefix = className.substring(9);
      // IE and Edge do not have getElementsByClassName on SVG elements, use polyfill instead
      visibleElements = getElementsByClassName(element.parentNode, 'visible' + classNamePrefix);
    }
    if (this.isDragging) {
      this.dragManager.dragEnd();
      this.app.addUndoPoint();
      this.isDragging = false;
    }
    else if (event.shiftKey || event.pointerType === 'touch') {
      this.selectionManager.toggleSelected(element);
      if (visibleElements) {
        // All plugins except spline
        if (visibleElements.length === 1) {
          // Only polyline has an opacity that needs to be overriden during selection
          if (visibleElements[0].getAttribute('class').indexOf('polyline') !== -1) {
            this.selectionManager.toggleSelected(visibleElements[0], 'override');
          }
          else {
            this.selectionManager.toggleSelected(visibleElements[0]);
          }
        }
        else { // spline
          // HTMLCollection is an 'array-like' object that needs to be spread into an array
          [...visibleElements].forEach((el) => this.selectionManager.toggleSelected(el));
        }
      }
    }
    else {
      this.selectionManager.deselectAll();
      this.selectionManager.select(element);
      if (visibleElements) {
        // All plugins except spline
        if (visibleElements.length === 1) {
          // Only polyline has an opacity that needs to be overriden during selection
          if (visibleElements[0].getAttribute('class').indexOf('polyline') !== -1) {
            this.selectionManager.select(visibleElements[0], 'override');
          }
          else {
            this.selectionManager.select(visibleElements[0]);
          }
        }
        else { // spline
          // HTMLCollection is an 'array-like' object that needs to be spread into an array
          [...visibleElements].forEach((el) => this.selectionManager.select(el));
        }
      }
    }

    this.removeCaptureAndListeners(event);
    this.activePointerId = null;
    this.initialEvent = null;
  }

  addCaptureAndListeners(event) {
    const element = event.currentTarget;
    element.setPointerCapture(event.pointerId);
    element.addEventListener('pointermove', this.onPointerMove, false);
    element.addEventListener('pointerup', this.onPointerUp, false);
    element.addEventListener('pointercancel', this.onPointerUp, false); // TODO: dedicated handler?
  }

  removeCaptureAndListeners(event) {
    const element = event.currentTarget;
    element.releasePointerCapture(event.pointerId);
    element.removeEventListener('pointermove', this.onPointerMove, false);
    element.removeEventListener('pointerup', this.onPointerUp, false);
    element.removeEventListener('pointercancel', this.onPointerUp, false);
  }
}
