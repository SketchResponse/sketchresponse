import { getElementsByClassName } from './util/ms-polyfills';

export default class DragManager {
  constructor(registry, selectionManager) {
    this.registry = registry;
    this.selectionManager = selectionManager;

    this.previousPosition = null;

    // Finding all selected elements is slow, so we'll cache them at the beginning of each drag
    this.elementsToDrag = null;
    this.visibleElements = null;
  }

  dragStart(element, position) {
    if (this.selectionManager.isSelected(element)) {
      // We may be dragging a group of elements; find them and cache them.
      // Note: it's possible this was the only element selected, but finding out is just as
      // expensive as getting all selected elements, so just do the latter.
      this.elementsToDrag = this.selectionManager.getSelected();
    } else {
       // possibly a no-op, but finding out is almost as expensive
      this.selectionManager.deselectAll();
      this.selectionManager.select(element);
      const className = element.getAttribute('class');
      if (className && className.substring(0, 9) === 'invisible') {
        const classNamePrefix = className.substring(9);
        // IE and Edge do not have getElementsByClassName on SVG elements, use polyfill instead
        this.visibleElements = getElementsByClassName(
          // eslint-disable-next-line prefer-template
          element.parentNode, 'visible' + classNamePrefix,
        );
        if (this.visibleElements) {
          // All plugins except spline
          if (this.visibleElements.length === 1) {
            // Only polyline has an opacity that needs to be overriden during selection
            if (this.visibleElements[0].getAttribute('class').indexOf('polyline') !== -1) {
              this.selectionManager.select(this.visibleElements[0], 'override');
            } else {
              this.selectionManager.select(this.visibleElements[0]);
            }
          } else { // spline
            // HTMLCollection is an 'array-like' object that needs to be spread into an array
            [...this.visibleElements].forEach((el) => this.selectionManager.select(el));
          }
        }
      }
      this.elementsToDrag = [element];
    }
    this.elementsToDrag = this.elementsToDrag.filter((el) => {
      const className = el.getAttribute('class');
      return !(className && className.substring(0, 7) === 'visible');
    });
    this.previousPosition = position;
  }

  dragMove(position) {
    let dx = position.clientX - this.previousPosition.clientX;
    let dy = position.clientY - this.previousPosition.clientY;

    // Note: we filter out selected elements with no onDrag callback and only drag those that have
    // one.
    // TODO: An alternative would be to prevent the entire drag altogether; is that better?
    const dragHandlers = this.elementsToDrag
      .map((element) => this.registry.get(element).onDrag)
      .filter((onDrag) => onDrag !== undefined);

    // First find out if any element is pushed out of bounds. In that case, we will
    // freeze the movement in that direction to keep the selection's overall shape.
    const inBoundsXHandlers = this.elementsToDrag
      .map((element) => this.registry.get(element).inBoundsX)
      .filter((inBoundsX) => inBoundsX !== undefined);

    const inBoundsYHandlers = this.elementsToDrag
      .map((element) => this.registry.get(element).inBoundsY)
      .filter((inBoundsY) => inBoundsY !== undefined);

    let insideX = true; let insideY = true;
    // eslint-disable-next-line no-restricted-syntax
    for (const inBoundsX of inBoundsXHandlers) {
      if (!inBoundsX(dx)) {
        insideX = false;
        break;
      }
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const inBoundsY of inBoundsYHandlers) {
      if (!inBoundsY(dy)) {
        insideY = false;
        break;
      }
    }
    dx = insideX ? dx : 0;
    dy = insideY ? dy : 0;

    dragHandlers.forEach((onDrag) => onDrag({ dx, dy }));
    // TODO:
    // 1) monitor return value of drag callbacks + revert drags as needed
    // 2) update order of cache to optimize future attempts (and recompute dragHandlers...?)

    this.previousPosition = position;
  }

  dragEnd() {
    this.visibleElements = null;
    this.previousPosition = null;
    // Important: allows these elements to be garbage collected if removed
    this.elementsToDrag = null;
  }
}
