import d3 from 'd3';

// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

export default class Toolbar {
  constructor(el, app, items) {
    this.el = el;
    this.app = app;
    this.items = items;

    this.render();
  }

  render() {
    const item = d3.select(this.el)
      .selectAll('.tb-items')
      .data(this.items);

    item.exit().remove();

    const newItem = item.enter()
      .append('li')
      .attr('class', 'tb-items')
      .html(this.createItemHTML);

    newItem.select('button')
      .on('click', d => {
        this.app.dispatch('tb-clicked', d.id);
      });

    newItem.selectAll('.tb-dropdown-item')
      .data(d => d.items || [])
      .select('button')
      .on('click', d => {
        this.app.dispatch('tb-dropdown-clicked', d.id);
      });
  }

  createItemHTML({type, id, icon, label, items}) {
    if (type === 'separator') return '<hr>';

    const hasDropdown = (items && items.length);
    const isSplit = (type === 'splitbutton');

    let html = `
      <button id="${id}" class="tb-button ${isSplit ? 'tb-split-button' : ''}">
        <img class="tb-icon" src="${icon || NULL_SRC}">
        <div class="tb-label">
          ${label + (hasDropdown ?
            '<span class="tb-dropdown-indicator">&nbsp;&#x25be;</span>' : '')}
        </div>
      </button>
    `;

    if (hasDropdown) html += `
      <menu class="tb-dropdown">
        ${items.map(({id, icon}) => `
          <li class="tb-dropdown-item">
            <button id="${id}" class="tb-dropdown-button">
              <img class="tb-dropdown-icon" src="${icon || NULL_SRC}">
            </button>
          </li>
        `).join('')}
      </menu>
    `;

    return html;
  }
}
