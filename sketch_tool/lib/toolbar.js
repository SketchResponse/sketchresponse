// For IE9-11, PhantomJS 1.x, Android 4.1-3, [Safari?]
import 'dom-shims/shim/Element.classList';
import z from './zdom';

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
    handleClick = e => {
      const [name, ...args] = e.currentTarget.getAttribute('data-action').split(':');
      this.app.dispatch(name, ...args);
    }

    z.render(this.el,
      z.each(this.items, ({type, id, icon, label, items}) => {
        if (type === 'separator') return z('hr');

        const hasDropdown = (items && items.length);
        const isSplit = (type === 'splitbutton');

        return z('div', {class: 'tb-item'},

          z('button', {
              id: id,
              'data-action': `tb-clicked:${id}`,
              class: `tb-button ${isSplit ? 'tb-split-button' : ''}`,
              onclick: handleClick
            },
            z('img', {class: 'tb-icon', src: icon || NULL_SRC}),
            z('div', {class: 'tb-label', 'data-action': `tb-dropdown-open:${id}`, onclick: handleClick},
              label || '',
              z.if(hasDropdown,
                z('span', {class: 'tb-dropdown-indicator'}, '\u00A0\u25be')  // nbsp + 'black down-pointing small triangle'
              )
            )
          ),

          z.if(hasDropdown,

          z('menu', {class: 'tb-dropdown'},
            z.each(items, item =>
              z('div', {class: 'tb-dropdown-item'},
                z('button', {
                    id: item.id,
                    'data-action': `tb-dropdown-clicked:${item.id}`,
                    class: 'tb-dropdown-button',
                    onclick: handleClick
                  },
                  z('img', {class: 'tb-dropdown-icon', src: item.icon || NULL_SRC})
                )
              )
            )
          )

          )
        )
      })
    );

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
}
