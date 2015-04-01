export default class Toolbar {
  constructor(targetElement, config) {
    let html = '';

    for (let item of config.items) {
      html += `<div class="${item.type}"></div>`;
    }

    targetElement.innerHTML = html;
  }
}
