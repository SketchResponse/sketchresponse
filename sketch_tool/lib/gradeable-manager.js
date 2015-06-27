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
        apiVersion: 0.1,
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
      this.messageBus.emit('warnUser', `An error occured while preparing your submission for grading; please contact your instructor. Details: ${error.stack}`);
      throw error;
    }
  }
}
