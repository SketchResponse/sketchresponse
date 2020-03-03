export function createInheritingObjectTree(oldObj, parent = Object.prototype) {
  const typeString = Object.prototype.toString.call(oldObj);

  if (typeString === '[object Object]') {
    // oldObj is a plain(ish) javascript object; make an inheriting variant and recurse
    const newObj = Object.create(parent);
    Object.keys(oldObj).forEach(key => {
      newObj[key] = createInheritingObjectTree(oldObj[key], newObj);
    });
    return newObj;
  }
  else if (typeString === '[object Array]') {
    // oldObj is an array; map it to an array with items inheriting from last known parent object
    return oldObj.map(item => createInheritingObjectTree(item, parent));
  }
  else {
    // oldObj is something else (primitive, Map, etc.); copy it without any inheritance
    return oldObj;
  }
}
