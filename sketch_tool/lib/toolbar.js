import z from './zdom';
import classnames from 'classnames';

// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

function isSplitButton(item) {
  return item.type === 'splitbutton';
}

function renderIcon(id, src, title) {
  return z('img.icon', {
    id: id,
    src: src || NULL_SRC,
    title: title
  });
}

function renderLabel(id, text, hasDropdown) {
  return z('div.label',
    z('span', {id: id}, text),
    z.if(hasDropdown,
      z('span', {'aria-label': 'Open dropdown menu'}, ' \u25be')
    )
  );
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
    console.log(payload);
    switch (payload.type) {
      case 'dropdown-open':
        this.state.openDropdownID = payload.id;
        break;

      case 'dropdown-clicked':
        this.state.selectedDropdownItemMap[payload.id] = payload.subId;
        /* falls through */
      case 'clicked':
        if (this.items.filter(item => item.id === payload.id)[0].type !== 'action') {
          this.state.activeItemID = payload.id;
        }
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
      activeItemID: firstItem.id,
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

        if (type === 'splitbutton') {
          const selectedItem = items.filter(item =>
            item.id === this.state.selectedDropdownItemMap[id])[0];

          icon = selectedItem.icon;

          // TODO: enabling this breaks zDOM:
          // items = items.filter(item => item.id !== selectedItem.id);
        }

        const hasDropdown = (items && items.length);
        const isOpen = (id === this.state.openDropdownID);
        const isActive = (id === this.state.activeItemID);

        return z('div.item', {
            id: id,
            'data-is-open': isOpen,
            'data-is-active': isActive,
          },

          z.if(type === 'button' || type === 'action',
            z('button', {
                onclick: e => this.app.dispatch('clicked', id),
                'aria-labelledby': `${id}-label ${id}-icon`,
              },
              renderIcon(`${id}-icon`, icon, ''),  // TODO: title
              renderLabel(`${id}-label`, label, hasDropdown)
            )
          ),

          z.if(type === 'splitbutton',
            z('button.split-button-main', {
                onclick: e => this.app.dispatch('clicked', id),
                'aria-labelledby': `${id}-label ${id}-icon`,
              },
              renderIcon(`${id}-icon`, icon, '')  // TODO: title
            ),
            z('button.split-button-aux', {
                onclick: e => this.app.dispatch('dropdown-open', id),
                'aria-haspopup': 'true',
              },
              renderLabel(`${id}-label`, label, hasDropdown)
            )
          ),

          z.if(hasDropdown,
            z('menu.dropdown',
              z.each(items, item =>
                z('div.dropdown-item',
                  z('button.dropdown-button', {
                      id: item.id,
                      onclick: e => this.app.dispatch('dropdown-clicked', id, item.id)
                    },
                    renderIcon(`${id}-icon`, item.icon, '')  // TODO: title
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
