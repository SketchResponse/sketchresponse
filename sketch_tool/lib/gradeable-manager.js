export const VERSION = 0.1;

export default class GradeableManager {
  constructor(config, messageBus) {
    this.config = config;
    this.messageBus = messageBus;

    this.registry = [];
    messageBus.on('registerGradeable', entry => this.registry.push(entry));
  }

  getGradeable() {
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
        response.data[entry.id] = entry.getGradeable();
        response.meta.dataVersions[entry.id] = entry.dataVersion;
      });

      return JSON.stringify(response);
    }
    catch(error) {
      this.messageBus.emit('warnUser', 'getGradeableError', error);
      throw error;
    }
  }
}
