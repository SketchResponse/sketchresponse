// IE and Edge do not have getElementsByClassName on SVG elements
export function getElementsByClassName(element, name) {
	let children, result = [];
	if (element.getElementsByClassName) {
	  return element.getElementsByClassName(name);
	}
	else {
	  children = element.getElementsByTagName('*');
	  // HTMLCollection is an 'array-like' object that needs to be spread into an array
      [...children].forEach(child => {
      	if (hasClass(child, name)) {
	      result.push(child);
	    }
	  });
	  return result;
	}
};

// Helper methods to manipulate classes on SVG elements for IE and Edge
// https://toddmotto.com/hacking-svg-traversing-with-ease-addclass-removeclass-toggleclass-functions/
// https://github.com/toddmotto/lunar
export function getClass(el) {
	return el.getAttribute('class');
};

export function hasClass(elem, name) {
	return new RegExp('(\\s|^)' + name + '(\\s|$)').test(getClass(elem));
};

export function addClass(elem, name) {
	!hasClass(elem, name) && elem.setAttribute('class', (getClass(elem) && getClass(elem) + ' ') + name);
};

export function removeClass(elem, name) {
	let news = getClass(elem).replace(new RegExp('(\\s|^)' + name + '(\\s|$)', 'g'), '$2');
	hasClass(elem, name) && elem.setAttribute('class', news);

};

export function toggleClass(elem, name) {
	(hasClass(elem, name) ? removeClass : addClass)(elem, name);
};
