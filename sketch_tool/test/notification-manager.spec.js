import events from 'events';
let EventEmitter = events.EventEmitter; // TODO: remove after upgrading to SystemJS > 0.17

import NotificationManager, { USER_MESSAGES } from 'sketch2/notification-manager';

describe('The Notification Manager', () => {
  const config = {config1: 1, config2: 2};
  const messageBus = new EventEmitter();
  let nm;

  beforeEach(() => {
    nm = new NotificationManager(config, messageBus);
  });

  afterEach(() => {
    messageBus.removeAllListeners();
  });

  it('is instantiated with a config object and an EventEmitter-style message bus', () => {
    expect(nm instanceof NotificationManager).toBe(true);
  });

  describe('handles the warnUser event', () => {
    function getAlertedMessage() {
      return window.alert.calls.mostRecent().args[0];
    }

    beforeEach(() => {
      spyOn(window, 'alert');
    });

    afterEach(() => {
      window.alert.calls.reset();
    });

    it('listens for the warnUser event', () => {
      let listeners = messageBus.listeners('warnUser');
      expect(listeners.length).toEqual(1);
      expect(listeners[0]).toEqual(jasmine.any(Function));
    });

    it('calls window.alert() with a known message when passed a known type', () => {
      Object.keys(USER_MESSAGES).forEach(type => {
        messageBus.emit('warnUser', type, new Error());
        expect(getAlertedMessage()).toContain(USER_MESSAGES[type]);
      });
    });

    it('calls window.alert() with a generic message when passed an unknown type', () => {
      messageBus.emit('warnUser', 'foobar', new Error());
      expect(getAlertedMessage()).toContain(USER_MESSAGES.unknownError);
    });

    it('includes the error type, message, and stack trace in the alerted message', () => {
      function throwingFunction() { throw new Error('Test error message'); }

      // Note: we have to actually throw the error to get a stack trace
      try {
        throwingFunction();
      }
      catch(error) {
        messageBus.emit('warnUser', 'foobar', error);
      }

      expect(getAlertedMessage()).toContain('Error:');
      expect(getAlertedMessage()).toContain('Test error message');
      expect(getAlertedMessage()).toContain('throwingFunction');
    });
  });
});
