import { EventEmitter } from 'events';
import StateManager from 'sketch2/state-manager';

describe('The State Manager', () => {
  const config = {config1: 1, config2: 2};
  const messageBus = new EventEmitter();
  let sm;

  beforeEach(() => {
    sm = new StateManager(config, messageBus);
  });

  afterEach(() => {
    messageBus.removeAllListeners();
  });

  it('is instantiated with a config object and an EventEmitter-style message bus', () => {
    expect(sm instanceof StateManager).toBe(true);
  });

  it('listens for the registerState event', () => {
    let listeners = messageBus.listeners('registerState');
    expect(listeners.length).toEqual(1);
    expect(listeners[0]).toEqual(jasmine.any(Function));
  })

  it('provides a getState method which returns a JSON string', () => {
    expect(JSON.parse(sm.getState())).toEqual(jasmine.any(Object));
  });

  describe('getState method', () => {
    // TODO: validate against JSON schema!

    it('contains the problem configuration', () => {
      const result = JSON.parse(sm.getState());
      expect(result.meta.config).toEqual(config);
    });

    it('contains data and data versions from all registrants', () => {
      const dataA = [{text: 'a1'}, {text: 'a2'}];
      const dataB = [{text: 'b1'}, {text: 'b2'}];

      messageBus.emit('registerState', {
        id: 'a',
        dataVersion: '0.1',
        getState: () => dataA,
        setState: state => {},
      });

      messageBus.emit('registerState', {
        id: 'b',
        dataVersion: '0.2',
        getState: () => dataB,
        setState: state => {},
      });

      const result = JSON.parse(sm.getState());
      expect(result.data).toEqual({a: dataA, b: dataB});
      expect(result.meta.dataVersions).toEqual({a: '0.1', b: '0.2'});
    });

    it('emits a user warning and re-throws when a registrant callback throws', () => {
      messageBus.emit('registerState', {
        id: 'a',
        dataVersion: '0.1',
        getState: () => { throw new Error('In callback'); },
        setState: state => {},
      });

      messageBus.on('warnUser', (type, error) => {
        expect(type).toEqual('getStateError');
        expect(error).toEqual(jasmine.any(Error));
      });

      expect(() => sm.getState()).toThrowError(Error, 'In callback');
    });
  });

  describe('setState method', () => {
    it('calls registrant callbacks with their saved data', () => {
      const dataA = [{text: 'a1'}, {text: 'a2'}];
      const dataB = [{text: 'b1'}, {text: 'b2'}];

      const data = {
        apiVersion: '0.1',
        meta: {
          config: {},
          dataVersions: {a: '0.1', b: '0.2'},
        },
        data: {a: dataA, b: dataB},
      };

      messageBus.emit('registerState', {
        id: 'a',
        dataVersion: '0.1',
        getState: () => {},
        setState: state => expect(state).toEqual(dataA),
      });

      messageBus.emit('registerState', {
        id: 'b',
        dataVersion: '0.2',
        getState: () => {},
        setState: state => expect(state).toEqual(dataB),
      });

      sm.setState(JSON.stringify(data));
    });

    it('emits a user warning and re-throws when a registrant callback throws', () => {
      const data = {
        apiVersion: '0.1',
        meta: {
          config: {},
          dataVersions: {a: '0.1'},
        },
        data: {a: {}},  // Forces callback for id:'a' to execute
      };

      messageBus.emit('registerState', {
        id: 'a',
        dataVersion: '0.1',
        getState: () => {},
        setState: state => { throw new Error('In callback'); },
      });

      messageBus.on('warnUser', (type, error) => {
        expect(type).toEqual('setStateError');
        expect(error).toEqual(jasmine.any(Error));
      });

      expect(() => sm.setState(JSON.stringify(data))).toThrowError(Error, 'In callback');
    });
  });
});
