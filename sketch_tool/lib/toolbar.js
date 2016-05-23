import z from './util/zdom';
import classnames from 'classnames';

export const VERSION = '0.1';
const TOOLBAR_ID = '$__toolbar';

// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

function renderIcon(id, src, alt) {
  return z('img.icon', {
    id: id,
    src: src || NULL_SRC,
    alt: alt,
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
  constructor(params, app) {
    this.params = params;
    this.app = app;
    this.el = document.getElementById('si-toolbar');  // TODO: pass container element in

    this.isActive = false;
    this.focusedItemID = null;
    this.openDropdownID = null;  // TODO: better name

    this.items = [
      {id: TOOLBAR_ID, activate: this.activate.bind(this), deactivate: this.deactivate.bind(this)},
    ];

    this.activeItemID = null;
    this.selectedDropdownItemMap = {};  // TODO: better name

    app.registerState({
      id: TOOLBAR_ID,
      dataVersion: VERSION,
      getState: this.getState.bind(this),
      setState: this.setState.bind(this),
    });

    app.__messageBus.on('registerToolbarItem', this.registerToolbarItem.bind(this));
    app.__messageBus.on('activateItem', this.activateItem.bind(this));
  }

  // Called when the toolbar plugin itself is activated
  activate() {
    this.isActive = true;
    // TODO: attach keyboard shortcuts here <<<
    this.render();
  }

  deactivate() {
    this.isActive = true;
    // TODO: detach keyboard shortcuts here <<<
    this.render();
  }

  getState() {
    return {
      activeItemID: this.activeItemID,
      selectedDropdownItemMap: this.selectedDropdownItemMap,
    };
  }

  setState(state) {
    this.selectedDropdownItemMap = state.selectedDropdownItemMap;
    this.activateItem(state.activeItemID);
    this.render();
  }

  activateItem(id) {
    if (id === this.activeItemID) return;
    try {
      const oldActiveItem = this.items.find(item => item.id === this.activeItemID);
      const newActiveItem = this.items.find(item => item.id === id);

      oldActiveItem && oldActiveItem.deactivate();
      newActiveItem && newActiveItem.activate();

      this.activeItemID = id;
    }
    catch(error) {
      this.app.__messageBus.emit('warnUser', 'pluginError', error);
    }
    this.render();
  }

  registerToolbarItem(item) {
    if (item.type === 'splitbutton') {
      if (!item.items || !item.items[0] || !item.items[0].id) {
        throw new TypeError('Toolbar split buttons must contain at least one item');
      }
      this.selectedDropdownItemMap[item.id] = item.items[0].id;
    }

    this.items.push(item);
    this.render();
  }

  render() {
    const renderableItems = this.items.filter(item =>
      ['separator', 'button', 'splitbutton'].indexOf(item.type) >= 0);

    z.render(this.el,
      z.each(renderableItems, ({type, id, icon, label, items, action}) => {
        if (type === 'separator') return z('hr');

        if (type === 'splitbutton') {
          const selectedItem = items.find(item => item.id === this.selectedDropdownItemMap[id]);
          icon = selectedItem.icon;
        }

        const hasDropdown = (items && items.length);
        const isOpen = (id === this.openDropdownID);
        const isActive = (id === this.activeItemID);

        return z('div.item', {
            id: id,
            'data-is-open': isOpen,
            'data-is-active': isActive,
          },

          z.if(type === 'button',
            z('button', {
                onclick: e => action ? action() : this.app.__messageBus.emit('activateItem', id),
                'aria-labelledby': `${id}-label ${id}-icon`,
              },
              renderIcon(`${id}-icon`, icon.src, icon.alt),
              renderLabel(`${id}-label`, label, hasDropdown)
            )
          )

          // z.if(type === 'splitbutton',
          //   z('button.split-button-main', {
          //       onclick: e => this.app.__messageBus.emit('activateItem', id),
          //       'aria-labelledby': `${id}-label ${id}-icon`,
          //     },
          //     renderIcon(`${id}-icon`, icon, '')  // TODO: title
          //   ),
          //   z('button.split-button-aux', {
          //       onclick: e => this.app.dispatch('dropdown-open', id),
          //       'aria-haspopup': 'true',
          //     },
          //     renderLabel(`${id}-label`, label, hasDropdown)
          //   )
          // ),

          // z.if(hasDropdown,
          //   z('menu.dropdown',
          //     z.each(items, item =>
          //       z('div.dropdown-item',
          //         z('button.dropdown-button', {
          //             id: item.id,
          //             onclick: e => this.app.dispatch('dropdown-clicked', id, item.id)
          //           },
          //           renderIcon(`${id}-icon`, item.icon, '')  // TODO: title
          //         )
          //       )
          //     )
          //   )
          // )
        )
      })
    );

    // Update focus if needed
    if (this.isActive && document.activeElement.id !== this.focusedItemID) {
      document.getElementById(this.focusedItemID).focus();
    }
  }
}
