// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

export default class Toolbar {
  constructor(el, app, items) {
    this.el = el;
    this.app = app;
    this.items = items;

    this.isActive = false;
    this.state = {
      openDropdownID: null,
      activeItemID: null,
      focusedItemID: null,
    };

    app.on('tb-dropdown-open', id => {
      this.state.openDropdownID = id;
      this.update();
    });

    this.render();
  }

  render() {
    // Create DOM elements
    for (let item of this.items) {
      const container = document.createElement('div');
      container.innerHTML = this.createItemHTML(item);
      while (container.childElementCount) {
        this.el.appendChild(container.firstChild);
      }
    }

    // Bind click listeners
    for (let button of this.el.querySelectorAll('[data-action]')) {
      button.addEventListener('click', e => {
        const [name, ...args] = e.currentTarget.getAttribute('data-action').split(':');
        this.app.dispatch(name, ...args);
      });
    }

    this.update();
  }

  update() {
    // Update the active dropdown / active item classes
    for (let item of this.el.querySelectorAll('.tb-item')) {
      const id = item.querySelector('.tb-button').id;
      item.classList.toggle('tb-dropdown-open', id === this.state.openDropdownID);
      item.classList.toggle('tb-active', id === this.state.activeItemID);
    }

    // Update focus if needed
    if (this.isActive && document.activeElement.id !== this.state.activeItemID) {
      document.getElementById(this.state.activeItemID).focus();
    }
  }

  createItemHTML({type, id, icon, label, items}) {
    if (type === 'separator') return '<li><hr></li>';

    const hasDropdown = (items && items.length);
    const isSplit = (type === 'splitbutton');

    return `
      <li class="tb-item">

        <button id="${id}" data-action="tb-clicked:${id}" class="tb-button ${isSplit ? 'tb-split-button' : ''}">
          <img class="tb-icon" src="${icon || NULL_SRC}">
          <div class="tb-label" data-action="tb-dropdown-open:${id}">
            ${label + (hasDropdown ?
              '<span class="tb-dropdown-indicator">&nbsp;&#x25be;</span>' : '')}
          </div>
        </button>

        ${hasDropdown ? `

        <menu class="tb-dropdown">
          ${items.map(item => `
            <li class="tb-dropdown-item">
              <button id="${item.id}" data-action="tb-dropdown-clicked:${item.id}" class="tb-dropdown-button">
                <img class="tb-dropdown-icon" src="${item.icon || NULL_SRC}">
              </button>
            </li>
          `).join('')}
        </menu>

        ` : ''}

      </li>
    `;
  }
}
