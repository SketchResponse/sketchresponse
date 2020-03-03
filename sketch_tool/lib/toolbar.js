import z from './util/zdom';

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
    z('span', { id: id }, text),
    z.if(hasDropdown,
      z('span', { 'aria-label': 'Open dropdown menu' }, ' \u25be'),
    ),
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
      { id: TOOLBAR_ID, activate: this.activate.bind(this), deactivate: this.deactivate.bind(this) },
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
    app.__messageBus.on('closeDropdown', this.closeDropdown.bind(this));
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
      const allItems = [];
      this.items.forEach((item) => {
        if (item.name === 'group') {
          item.items.forEach((item) => {
            allItems.push(item);
          });
        }
        else {
          allItems.push(item);
        }
      });
      const oldActiveItem = allItems.find((item) => item.id === this.activeItemID);
      const newActiveItem = allItems.find((item) => item.id === id);

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

  openDropdown(id) {
    this.openDropdownID = id;
    this.render();
  }

  closeDropdown() {
    this.openDropdownID = null;
    this.render();
  }

  selectDropdownItem(id, itemId) {
    this.openDropdownID = null;
    this.selectedDropdownItemMap[id] = itemId;
    this.app.__messageBus.emit('finalizeShapes', itemId);
    this.app.__messageBus.emit('activateItem', itemId);
    this.render();
  }

  render() {
    const renderableItems = this.items.filter((item) =>
      ['separator', 'button', 'splitbutton'].indexOf(item.type) >= 0);

    z.render(this.el,
      z.each(renderableItems, ({ type, id, icon, label, color, items, action }) => {
        if (type === 'separator') return z('hr');
        let selectedItem;
        let isActive;
        if (type === 'splitbutton') {
          selectedItem = items.find((item) => item.id === this.selectedDropdownItemMap[id]);
          icon = selectedItem.icon;
          color = selectedItem.color;
          isActive = (selectedItem.id === this.activeItemID);
        }
        else if (type === 'button') {
          isActive = (id === this.activeItemID);
        }

        const hasDropdown = (items && items.length);
        const isOpen = (id === this.openDropdownID);

        return z('div.item', {
            id: id,
            'data-is-open': isOpen,
            'data-is-active': isActive,
            style: isActive ? `border-bottom-color: ${color};` : '',
          },
          z.if(type === 'button',
            z('button', {
                onclick: () => {
                  // Finalize any shape that isn't
                  this.app.__messageBus.emit('finalizeShapes', id);
                  action ? action() : this.activateItem(id);
                },
                'aria-labelledby': `${id}-label ${id}-icon`,
              },
              renderIcon(`${id}-icon`, icon.src, icon.alt),
              renderLabel(`${id}-label`, label, hasDropdown),
            ),
          ),
          z.if(type === 'splitbutton',
            z('button.split-button-main', {
                onclick: () => {
                  // Finalize any shape that isn't
                  this.app.__messageBus.emit('finalizeShapes', this.selectedDropdownItemMap[id]);
                  this.activateItem(this.selectedDropdownItemMap[id]);
                },
                'aria-labelledby': `${id}-label ${id}-icon`,
              },
              renderIcon(`${id}-icon`, icon.src, icon.alt),  // TODO: title
            ),
            z('button.split-button-aux', {
                onclick: () => {
                  // Finalize any shape that isn't
                  this.app.__messageBus.emit('finalizeShapes', this.selectedDropdownItemMap[id]);
                  this.activateItem(this.selectedDropdownItemMap[id]);
                  this.openDropdown(id);
                },
                'aria-haspopup': 'true',
              },
              renderLabel(`${id}-label`, label, hasDropdown),
            ),
          ),
          z.if(hasDropdown,
            z('menu.dropdown',
              z.each(items, (item) =>
                z('div.dropdown-item',
                  z('button.dropdown-button', {
                      id: item.id,
                      onpointerdown: () => this.selectDropdownItem(id, item.id),
                    },
                    renderIcon(`${id}-icon`, item.icon.src, item.icon.alt),  // TODO: title
                    renderLabel(`${id}-label`, item.label, false),
                  ),
                ),
              ),
            ),
          ),
        );
      }),
    );

    // Update focus if needed
    if (this.isActive && document.activeElement.id !== this.focusedItemID) {
      document.getElementById(this.focusedItemID).focus();
    }
  }
}
