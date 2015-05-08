import z from './zdom';
import classnames from 'classnames';

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

    this.render();
  }

  handleEvent(payload) {
    switch (payload.type) {
      case 'tb-dropdown-open':
        this.state.openDropdownID = payload.id;
        break;

      case 'tb-clicked':
      case 'tb-dropdown-clicked':
        this.state.openDropdownID = null;
        break;
    }

    this.render();
  }

  getInitialState() {
    const firstItem = this.items[0];

    if (!(firstItem && firstItem.type && firstItem.id)) {
      throw new TypeError('The first toolbar item must contain a type and an ID');
    }

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

  render() {
    z.render(this.el,
      z.each(this.items, ({type, id, icon, label, items}) => {
        if (type === 'separator') return z('hr');

        const hasDropdown = (items && items.length);
        const isSplit = (type === 'splitbutton');
        const isOpen = (id === this.state.openDropdownID);
        const isActive = (id === this.state.activeItemID);

        return z('div.tb-item', {
            class: classnames({'tb-dropdown-open': isOpen, 'tb-active': isActive})
          },

          z('button.tb-button', {
              id: id,
              class: classnames({'tb-split-button': isSplit}),
              onclick: e => this.app.dispatch('tb-clicked', id)
            },
            z('img.tb-icon', {src: icon || NULL_SRC}),
            z('div.tb-label', {onclick: e => this.app.dispatch('tb-dropdown-open', id)},
              label || '',
              z.if(hasDropdown,
                z('span.tb-dropdown-indicator', '\u00A0\u25be')  // nbsp + 'black down-pointing small triangle'
              )
            )
          ),

          z.if(hasDropdown,

          z('menu.tb-dropdown',
            z.each(items, item =>
              z('div.tb-dropdown-item',
                z('button.tb-dropdown-button', {
                    id: item.id,
                    onclick: e => this.app.dispatch('tb-dropdown-clicked', item.id)
                  },
                  z('img.tb-dropdown-icon', {src: item.icon || NULL_SRC})
                )
              )
            )
          )

          )
        )
      })
    );

    // Update focus if needed
    if (this.isActive && document.activeElement.id !== this.state.focusedItemID) {
      document.getElementById(this.state.focusedItemID).focus();
    }
  }
}
