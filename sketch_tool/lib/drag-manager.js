export default class DragManager {
  constructor(registry, selectionManager) {
    this.registry = registry;
    this.selectionManager = selectionManager;

    this.previousPosition = null;

    // Finding all selected elements is slow, so we'll cache them at the beginning of each drag
    this.elementsToDrag = null;
    this.initialDrag = false;
    this.visibleElement = null;
  }

  dragStart(element, position) {
    if (this.selectionManager.isSelected(element)) {
      // We may be dragging a group of elements; find them and cache them.
      // Note: it's possible this was the only element selected, but finding out is just as
      // expensive as getting all selected elements, so just do the latter.
      this.elementsToDrag = this.selectionManager.getSelected();
    }
    else {
      this.selectionManager.deselectAll();  // possibly a no-op, but finding out is almost as expensive
      this.selectionManager.select(element);
      let className = element.getAttribute('class');
      if (className && className.substring(0, 9) == 'invisible') {
        let classNamePrefix = className.substring(9);
        this.visibleElement = element.parentNode.getElementsByClassName('visible'+classNamePrefix)[0];
        if (this.visibleElement) {
          this.selectionManager.select(this.visibleElement);
        }
      }
      this.elementsToDrag = [element];
      this.initialDrag = true;
    }
    this.elementsToDrag = this.elementsToDrag.filter(element => {
      let className = element.getAttribute('class');
      return !(className && className.substring(0, 7) == 'visible')
    });
    this.previousPosition = position;
  }

  dragMove(position) {
    let x = position.clientX,
        y = position.clientY;
    let dx = position.clientX - this.previousPosition.clientX;
    let dy = position.clientY - this.previousPosition.clientY;
    const elToDrag = this.registry.get(this.elementsToDrag[0]);

    if (this.initialDrag && elToDrag.onInitialDrag && elToDrag.isLastPoint) {
      if (elToDrag.isLastPoint()) {
        elToDrag.onInitialDrag(x, y);
        if (this.visibleElement == null) {
          let element = elToDrag.element;
          let className = element.getAttribute('class');
          if (className && className.substring(0, 9) == 'invisible') {
            let classNamePrefix = className.substring(9);
            this.visibleElement = element.parentNode.getElementsByClassName('visible'+classNamePrefix)[0];
            if (this.visibleElement) {
              this.selectionManager.select(this.visibleElement);
            }
          }
        }
        return;
      }
    }

    // Note: we filter out selected elements with no onDrag callback and only drag those that have one
    // TODO: An alternative would be to prevent the entire drag altogether; is that better?
    const dragHandlers = this.elementsToDrag
      .map(element => this.registry.get(element).onDrag)
      .filter(onDrag => onDrag !== undefined);

    // First find out if any element is pushed out of bounds. In that case, we will
    // freeze the movement in that direction to keep the selection's overall shape.
    const inBoundsXHandlers = this.elementsToDrag
      .map(element => this.registry.get(element).inBoundsX)
      .filter(inBoundsX => inBoundsX !== undefined);

    const inBoundsYHandlers = this.elementsToDrag
      .map(element => this.registry.get(element).inBoundsY)
      .filter(inBoundsY => inBoundsY !== undefined);

    let insideX = true, insideY = true;
    for (let inBoundsX of inBoundsXHandlers) {
      if (!inBoundsX(dx)) {
        insideX = false;
        break;
      }
    }
    for (let inBoundsY of inBoundsYHandlers) {
      if (!inBoundsY(dy)) {
        insideY = false;
        break;
      }
    }
    dx = insideX ? dx : 0;
    dy = insideY ? dy : 0;

    dragHandlers.forEach(onDrag => onDrag({dx, dy}));
    // TODO:
    // 1) monitor return value of drag callbacks + revert drags as needed
    // 2) update order of cache to optimize future attempts (and recompute dragHandlers...?)

    this.previousPosition = position;
  }

  dragEnd() {
    const elToDrag = this.registry.get(this.elementsToDrag[0]);
    if (elToDrag.onInitialDragEnd) {
      elToDrag.onInitialDragEnd();
    }
    this.initialDrag = false;
    this.visibleElement = null;
    this.previousPosition = null;
    this.elementsToDrag = null;  // Important: allows these elements to be garbage collected if removed
  }
}
