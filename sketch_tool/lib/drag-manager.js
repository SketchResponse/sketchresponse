export default class DragManager {
  constructor(registry, selectionManager) {
    this.registry = registry;
    this.selectionManager = selectionManager;

    this.previousPosition = null;

    // Finding all selected elements is slow, so we'll cache them at the beginning of each drag
    this.elementsToDrag = null;
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
      this.elementsToDrag = [element];
    }
    this.previousPosition = position;
  }

  dragMove(position) {
    let dx = position.clientX - this.previousPosition.clientX;
    let dy = position.clientY - this.previousPosition.clientY;

    // Note: we filter out selected elements with no onDrag callback and only drag those that have one
    // TODO: An alternative would be to prevent the entire drag altogether; is that better?
    const dragHandlers = this.elementsToDrag
      .map(element => this.registry.get(element).onDrag)
      .filter(onDrag => onDrag !== undefined);

    dragHandlers.forEach(onDrag => onDrag({dx, dy}));
    // TODO:
    // 1) monitor return value of drag callbacks + revert drags as needed
    // 2) update order of cache to optimize future attempts (and recompute dragHandlers...?)

    this.previousPosition = event;
  }

  dragEnd() {
    this.previousPosition = null;
    this.elementsToDrag = null;  // Important: allows these elements to be garbage collected if removed
  }
}
