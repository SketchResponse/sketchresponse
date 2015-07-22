export const VERSION = '0.1';

export default class StateManager {
  constructor(config, messageBus) {
    this.config = config;
    this.messageBus = messageBus;

    this.registry = [];
    messageBus.on('registerState', entry => this.registry.push(entry));

    // TODO: Refactor into history manager
    this.undoStack = [];
    this.redoStack = [];
    messageBus.on('addUndoPoint', this.addUndoPoint.bind(this));
    messageBus.on('undo', this.undo.bind(this));
    messageBus.on('redo', this.redo.bind(this));

    // TODO: Refactor into history manager
    messageBus.emit('registerState', {
      id: '$__history',
      dataVersion: VERSION,
      getState: () => {
        const state = {
          undoStack: this.undoStack.slice(-5).map(JSON.parse),  // Only keep the 5 most recent undos
          redoStack: this.redoStack.slice(-3).map(JSON.parse),  // Only keep the 3 most recent redos
        };
        return btoa(JSON.stringify(state));
      },
      setState: state => {
        const decoded = JSON.parse(atob(state));
        this.undoStack = decoded.undoStack.map(JSON.stringify);
        this.redoStack = decoded.redoStack.map(JSON.stringify);
      },
    });
  }

  // TODO: Refactor into history manager
  addUndoPoint() {
    this.undoStack.push(this.getUndoState());
    this.redoStack = [];
  }

  // TODO: Refactor into history manager
  undo() {
    if (this.undoStack.length <= 1) return;  // Leave one item in the undo stack
    this.redoStack.push(this.undoStack.pop());
    this.setUndoState(this.undoStack[this.undoStack.length - 1]);
  }

  // TODO: Refactor into history manager
  redo() {
    if (this.redoStack.length <= 0) return;
    this.undoStack.push(this.redoStack.pop());
    this.setUndoState(this.undoStack[this.undoStack.length - 1]);
  }

  // TODO: refactor to delete somehow (plugin state vs. app state)
  getUndoState() {
    const state = {};
    this.registry.forEach(entry => {
      state[entry.id] = entry.getState();
    });
    delete state.$__toolbar;  // TODO: don't hard-code constants!
    delete state.$__history;  // TODO: don't hard-code constants!
    return JSON.stringify(state);
  }

  // TODO: refactor to delete somehow (plugin state vs. app state)
  setUndoState(stateString) {
    const state = JSON.parse(stateString);
    this.registry.forEach(entry => {
      if (state.hasOwnProperty(entry.id)) entry.setState(state[entry.id]);
    });
  }

  getState() {
    try {
      const response = {
        apiVersion: VERSION,
        meta: {
          config: this.config,
          dataVersions: {},
        },
        data: {},
      };

      this.registry.forEach(entry => {
        // TODO: only save state when plugins actually have state
        response.data[entry.id] = entry.getState();
        response.meta.dataVersions[entry.id] = entry.dataVersion;
      });

      return JSON.stringify(response);
    }
    catch(error) {
      this.messageBus.emit('warnUser', 'getStateError', error);
      throw error;
    }
  }

  setState(stateString) {
    try {
      const state = JSON.parse(stateString);
      // TODO: format version checking

      this.registry.forEach(entry => {
        // TODO: plugin version checking?
        if (state.data.hasOwnProperty(entry.id)) entry.setState(state.data[entry.id]);
      });
    }
    catch(error) {
      this.messageBus.emit('warnUser', 'setStateError', error);
      throw error;
    }
  }
}
