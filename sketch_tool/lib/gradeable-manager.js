export const VERSION = '0.1';

export default class GradeableManager {
  constructor(config, messageBus) {
    this.config = config;
    this.messageBus = messageBus;

    this.registry = [];
    messageBus.on('registerGradeable', entry => this.registry.push(entry));
  }

  getGradeable() {
    try {
      // Finalize all shapes before returning response
      this.messageBus.emit('finalizeShapes');
      const response = {
        apiVersion: VERSION,  // TODO: Important: better version handling
        meta: {
          config: this.config,
          dataVersions: {},
        },
        data: {},
      };

      this.registry.forEach(entry => {
        response.data[entry.id] = entry.getGradeable();
        response.meta.dataVersions[entry.id] = entry.version;  // TODO: versioning
      });

      return JSON.stringify(response);
    }
    catch(error) {
      this.messageBus.emit('warnUser', 'getGradeableError', error);
      throw error;
    }
  }
}
