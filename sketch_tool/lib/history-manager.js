export const VERSION = '0.1';

export default class HistoryManager {
  constructor(config, messageBus, stateManager) {
    this.config = config;
    this.messageBus = messageBus;
    this.stateManager = stateManager;

    this.undoStack = [];
    this.redoStack = [];
    messageBus.on('addUndoPoint', this.addUndoPoint.bind(this));
    messageBus.on('undo', this.undo.bind(this));
    messageBus.on('redo', this.redo.bind(this));

    messageBus.emit('registerState', {
      id: '$__history',
      dataVersion: VERSION,
      getState: () => {
        const state = {
          undoStack: this.undoStack.slice(-5),  // Only keep the 5 most recent undos
          redoStack: this.redoStack.slice(-3),  // Only keep the 3 most recent redos
        };
        return btoa(JSON.stringify(state));
      },
      setState: state => {
        const decoded = JSON.parse(atob(state));
        this.undoStack = decoded.undoStack;
        this.redoStack = decoded.redoStack;
      },
    });
  }

  addUndoPoint() {
    const state = this.stateManager.getPluginState();
    // TODO: don't hard code this
    delete state.$__history;
    delete state.$__toolbar;

    this.undoStack.push(state);
    this.redoStack = [];
  }

  undo() {
    if (this.undoStack.length <= 1) return;  // Leave one item in the undo stack
    this.redoStack.push(this.undoStack.pop());
    this.stateManager.setPluginState(this.undoStack[this.undoStack.length - 1]);
  }

  redo() {
    if (this.redoStack.length <= 0) return;
    this.undoStack.push(this.redoStack.pop());
    this.stateManager.setPluginState(this.undoStack[this.undoStack.length - 1]);
  }
}
