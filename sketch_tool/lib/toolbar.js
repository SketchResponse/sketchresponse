// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

function isSplitButton(item) {
  return item.type === 'splitbutton';
}

export default class Toolbar {
  constructor(el, app, items) {
    this.el = el;
    this.app = app;
    this.items = items;

    this.isActive = false;
    this.state = this.getInitialState();

    app.on('tb-dropdown-open', id => {
      this.state.openDropdownID = id;
      this.render();
    });

    this.render({firstTime: true});
  }

  getInitialState() {
    const firstItem = this.items[0];

    let state = {
      openDropdownID: null,
      activeItemID: isSplitButton(firstItem) ? firstItem.items[0].id : firstItem.id,
      focusedItemID: firstItem.id,
      selectedDropdownItemMap: {},
    };

    this.items
      .filter(isSplitButton)
      .forEach(item => state.selectedDropdownItemMap[item.id] = item.items[0].id);

    return state;
  }

  render({firstTime}) {
    if (firstTime) {
      // Create DOM elements
      this.el.innerHTML = this.items.map(this.createItemHTML).join('');

      // Bind click listeners
      for (let button of this.el.querySelectorAll('[data-action]')) {
        button.addEventListener('click', e => {
          const [name, ...args] = e.currentTarget.getAttribute('data-action').split(':');
          this.app.dispatch(name, ...args);
        });
      }
    }

    // Update the active dropdown / active item classes
    for (let item of this.el.querySelectorAll('.tb-item')) {
      const id = item.querySelector('.tb-button').id;
      item.classList.toggle('tb-dropdown-open', id === this.state.openDropdownID);
      item.classList.toggle('tb-active', id === this.state.activeItemID);
    }

    // Update focus if needed
    if (this.isActive && document.activeElement.id !== this.state.focusedItemID) {
      document.getElementById(this.state.focusedItemID).focus();
    }
  }

  createItemHTML({type, id, icon, label, items}) {
    if (type === 'separator') return '<hr>';

    const hasDropdown = (items && items.length);
    const isSplit = (type === 'splitbutton');

    return `
      <div class="tb-item">

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
            <div class="tb-dropdown-item">
              <button id="${item.id}" data-action="tb-dropdown-clicked:${item.id}" class="tb-dropdown-button">
                <img class="tb-dropdown-icon" src="${item.icon || NULL_SRC}">
              </button>
            </div>
          `).join('')}
        </menu>

        ` : ''}

      </div>
    `;
  }
}
