import d3 from 'd3';

export default class Toolbar {
  constructor(el, app, items) {
    this.el = el;
    this.app = app;
    this.items = items;

    this.render();
  }

  render() {
    const item = d3.select(this.el)
      .selectAll('li')
      .data(this.items);

    item.exit().remove();

    item.enter()
      .append('li')
      .html(this.createItemHTML);
  }

  createItemHTML(item) {
    if (item.type === 'separator') return '<hr>';

    return `
      <button id="${item.id}">
        <img class="tb-icon" src="${item.icon}">
        <div class="tb-label">
          ${item.label}
        </div>
      </button>
    `;
  }
}
