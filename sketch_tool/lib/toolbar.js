export default class Toolbar {
  constructor(targetElement, config) {
    targetElement.classList.add('si-toolbar');

    for (let itemConfig of config.items || []) {
      let element = document.createElement('li');
      let renderMethod = this[itemConfig.type];
      renderMethod(element, itemConfig);
      targetElement.appendChild(element);
    }
  }

  button(element, itemConfig) {
    element.className = 'button';
  }
}

