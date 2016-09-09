var FLAG = '$__DOMAttrCache';  // used as both our cache property name and as an "Unset" value

function getCache(element, ns, name) {
  if (ns === null) ns = '';
  var key = String(ns) + '|' + name;
  return (element[FLAG] || (element[FLAG] = {}))[key] || (element[FLAG][key] = {value: FLAG});
}

export function setAttributeNS(element, ns, name, value) {
  var cache = getCache(element, ns, name.split(name.indexOf(':') + 1));  // strip prefix when storing
  if (cache.value === String(value)) return;
  cache.value = String(value);
  if (!cache.pending) {
    cache.pending = true;
    window.requestAnimationFrame(function flush() {
      if (cache.value === FLAG) element.removeAttributeNS(ns, name);
      else element.setAttributeNS(ns, name, cache.value);
      cache.pending = false;
    });
  }
}

export function getAttributeNS(element, ns, name) {
  var value = getCache(element, ns, name).value;
  return value === FLAG ? null : value;
}

export function removeAttributeNS(element, ns, name) {
  setAttributeNS(element, ns, name, FLAG);
}
