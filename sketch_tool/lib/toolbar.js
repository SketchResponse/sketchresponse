// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

export default class Toolbar {
  constructor(el, app, items) {
    this.el = el;
    this.app = app;
    this.items = items;

    this.initDOM();
    this.render();
  }

  initDOM() {
    for (let item of this.items) {
      const li = document.createElement('li');
      li.className = 'tb-item';
      li.innerHTML = this.createItemHTML(item);

      for (let button of li.querySelectorAll('.tb-button')) {
        button.addEventListener('click', e => {
          this.app.dispatch('tb-clicked', e.currentTarget.id);
        });
      }

      for (let button of li.querySelectorAll('.tb-dropdown-button')) {
        button.addEventListener('click', e => {
          this.app.dispatch('tb-dropdown-clicked', e.currentTarget.id);
        });
      }

      this.el.appendChild(li);
    }
  }

  render() {
    // TODO: set styles, etc. here in response to state
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
