export const VERSION = '0.1';
const TOOLBAR_ID = '$__toolbar';

export default class Toolbar {
  constructor(params, app) {
    this.params = params;
    this.app = app;

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
    this.activeItemID = state.activeItemID;
    this.selectedDropdownItemMap = state.selectedDropdownItemMap;

    this.activateItem(this.activeItemID);
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
      state.selectedDropdownItemMap[item.id] = item.items[0].id;
    }

    this.items.push(item);
    this.render();
  }

  render() {
    // TODO
  }
}
