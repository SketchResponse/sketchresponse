// Helper methods to manipulate classes on SVG elements for IE and Edge
// https://toddmotto.com/hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions/
// https://github.com/toddmotto/lunar
export function getClass(el) {
  return el.getAttribute('class');
}

export function hasClass(elem, name) {
  // eslint-disable-next-line prefer-template
  return new RegExp('(\\s|^)' + name + '(\\s|$)').test(getClass(elem));
}

export function addClass(elem, name) {
  // eslint-disable-next-line prefer-template, no-unused-expressions
  !hasClass(elem, name) && elem.setAttribute('class', (getClass(elem) && getClass(elem) + ' ') + name);
}

export function removeClass(elem, name) {
  // eslint-disable-next-line prefer-template
  const news = getClass(elem).replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
  // eslint-disable-next-line no-unused-expressions
  hasClass(elem, name) && elem.setAttribute('class', news);
}

export function toggleClass(elem, name) {
  (hasClass(elem, name) ? removeClass : addClass)(elem, name);
}

// IE and Edge do not have getElementsByClassName on SVG elements
export function getElementsByClassName(element, name) {
  const result = [];
  if (element.getElementsByClassName) {
    return element.getElementsByClassName(name);
  }

  const children = element.getElementsByTagName('*');
  // HTMLCollection is an 'array-like' object that needs to be spread into an array
  [...children].forEach((child) => {
    if (hasClass(child, name)) {
      result.push(child);
    }
  });
  return result;
}
