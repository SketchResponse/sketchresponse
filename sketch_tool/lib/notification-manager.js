export const USER_MESSAGES = {
  unknownError: 'An unknown error occured',
  pluginError: 'An error occured in a SketchInput plugin',
  getStateError: 'An error occured while preparing your submission for saving',
  setStateError: 'An error occured while importing your saved data',
  getGradeableError: 'An error occured while preparing your submission for grading',
};

export default class NotificationManager {
  constructor(config, messageBus) {
    messageBus.on('warnUser', this.warnUser.bind(this));
  }

  // eslint-disable-next-line class-methods-use-this
  warnUser(type, error) {
    const message = USER_MESSAGES[type] || USER_MESSAGES.unknownError;
    // eslint-disable-next-line no-alert
    window.alert(`SketchInput: ${message}; please contact your instructor. Details: ${error.stack}`);
  }
}
