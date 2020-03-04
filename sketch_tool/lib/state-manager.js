import deepCopy from './util/deep-copy';

export const VERSION = '0.1';

export default class StateManager {
  constructor(config, messageBus, initialState) {
    this.config = config;
    this.messageBus = messageBus;
    if (initialState) {
      this.initialState = initialState;
      messageBus.on('loadInitialState', () => this.loadInitialState());
    }

    // TODO: convert to a key-based registry?
    this.registry = [];
    messageBus.on('registerState', (entry) => this.registry.push(entry));
  }

  getPluginState() {
    const state = {};
    this.registry.forEach((entry) => {
      state[entry.id] = entry.getState();
    });
    return deepCopy(state); // Use deepCopy to keep plugin state isolated
  }

  setPluginState(state) {
    state = deepCopy(state); // Use deepCopy to keep plugin state isolated
    this.registry.forEach((entry) => {
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

      this.registry.forEach((entry) => {
        // TODO: only save state when plugins actually have state
        response.data[entry.id] = entry.getState();
        response.meta.dataVersions[entry.id] = entry.dataVersion;
      });

      return JSON.stringify(response);
    } catch (error) {
      this.messageBus.emit('warnUser', 'getStateError', error);
      throw error;
    }
  }

  setState(stateString) {
    try {
      const state = JSON.parse(stateString);
      // TODO: format version checking

      this.registry.forEach((entry) => {
        // TODO: plugin version checking?
        if (state.data.hasOwnProperty(entry.id)) entry.setState(state.data[entry.id]);
      });

      this.messageBus.emit('stateSet');
    } catch (error) {
      this.messageBus.emit('warnUser', 'setStateError', error);
      throw error;
    }
  }

  loadInitialState() {
    try {
      this.registry.forEach((entry) => {
        if (this.initialState.hasOwnProperty(entry.id)) entry.setState(this.initialState[entry.id]);
      });

      this.messageBus.emit('stateSet');
    } catch (error) {
      this.messageBus.emit('warnUser', 'setStateError', error);
      throw error;
    }
  }
}
