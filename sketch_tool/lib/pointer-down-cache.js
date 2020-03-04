export default class PointerDownCache {
  constructor(rootElement) {
    this.cache = new Map();
    rootElement.addEventListener('pointerdown', this.add.bind(this), true);
    rootElement.addEventListener('pointerup', this.delete.bind(this), true);
    rootElement.addEventListener('pointercancel', this.delete.bind(this), true);
    rootElement.addEventListener('gotpointercapture', this.delete.bind(this), true); // So we don't steal captured pointers
  }

  add(event) { this.cache.set(event.pointerId, event); }
  delete(event) { this.cache.delete(event.pointerId); }

  getNearestByClientRect({ left, right, top, bottom }) {
    // Find the center
    const clientX = (left + right) / 2;
    const clientY = (top + bottom) / 2;
    return this.getNearestByClientXY({ clientX, clientY });
  }

  getNearestByClientXY({ clientX, clientY }) {
    let minDistSquared = Infinity;
    let nearestEvent = null;
    for (const event of this.cache.values()) {
      const distSquared = (clientX - event.clientX) ** 2 + (clientY - event.clientY) ** 2;
      if (distSquared < minDistSquared) {
        minDistSquared = distSquared;
        nearestEvent = event;
      }
    }
    return nearestEvent;
  }
}
