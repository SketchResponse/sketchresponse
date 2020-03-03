const CACHE = '$__FastAttr_Cache';
const NONE = '$__FastAttr_None';

class FastAttr {
  constructor(el) {
    this.el = el;
    this.cacheMap = el[CACHE] || (el[CACHE] = {});
  }

  getAttributeNS(ns, name) {
    const cache = this.getCache(ns, name);
    return cache.value === NONE ? undefined : cache.value;
  }

  setAttributeNS(ns, name, value) {
    const cache = this.getCache(ns, name);
    if (cache.value === value) return;
    cache.ns = ns;
    cache.name = name;
    cache.value = value;
    this.schedule(cache);
  }

  removeAttributeNS(ns, name) { this.setAttributeNS(ns, name, NONE); }

  getAttribute(name) { this.getAttributeNS(null, name); }
  setAttribute(name, value) { this.setAttributeNS(null, name, value); }
  removeAttribute(name) { this.setAttributeNS(null, name, NONE); }

  getCache(ns, name) {
    const key = (ns || NONE) + '|' + name;
    return this.cacheMap[key] || (this.cacheMap[key] = {});
  }

  schedule(cache) {
    if (cache.pending) return;
    window.requestAnimationFrame(this.flush.bind(this));
    cache.pending = true;
  }

  flush() {
    for (let key in this.cacheMap) {  // Assume only own properties
      const cache = this.cacheMap[key];
      if (!cache.pending) continue;
      if (cache.value === NONE) this.el.removeAttributeNS(cache.ns, cache.name);
      else this.el.setAttributeNS(cache.ns, cache.name, cache.value);
      cache.pending = false;
    }
  }
}
