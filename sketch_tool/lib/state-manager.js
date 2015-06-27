export const VERSION = 0.1;

export default class StateManager {
  constructor(config, messageBus) {
    this.config = config;
    this.messageBus = messageBus;

    this.registry = [];
    messageBus.on('registerState', entry => this.registry.push(entry));
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
      this.messageBus.emit('warnUser', `An error occured while preparing your submission for saving; please contact your instructor. Details: ${error.stack}`);
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
      this.messageBus.emit('warnUser', `An error occured while importing your saved data; please contact your instructor. Details: ${error.stack}`);
      throw error;
    }
  }
}
