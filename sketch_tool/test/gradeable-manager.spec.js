import events from 'events';
let EventEmitter = events.EventEmitter; // TODO: remove after upgrading to SystemJS > 0.17

import GradeableManager from 'sketch2/gradeable-manager';

describe('The Gradeable Manager', () => {
  const config = {config1: 1, config2: 2};
  const messageBus = new EventEmitter();
  let gm;

  beforeEach(() => {
    gm = new GradeableManager(config, messageBus);
  });
  
  afterEach(() => {
    messageBus.removeAllListeners();
  });

  it('is instantiated with a config object and an EventEmitter-style message bus', () => {
    expect(gm instanceof GradeableManager).toBe(true);
  });

  it('listens for the registerGradeable event', () => {
    let listeners = messageBus.listeners('registerGradeable');
    expect(listeners.length).toEqual(1);
    expect(listeners[0]).toEqual(jasmine.any(Function));
  })

  it('provides a getGradeable method which returns a JSON string', () => {
    expect(JSON.parse(gm.getGradeable())).toEqual(jasmine.any(Object));
  });

  describe('getGradeable method', () => {
    // TODO: validate against JSON schema!

    it('contains the problem configuration', () => {
      const result = JSON.parse(gm.getGradeable());
      expect(result.meta.config).toEqual(config);
    });

    it('contains data and data versions from all registrants', () => {
      const dataA = [{text: 'a1'}, {text: 'a2'}];
      const dataB = [{text: 'b1'}, {text: 'b2'}];

      messageBus.emit('registerGradeable', {
        id: 'a',
        dataVersion: '0.1',
        getGradeable: () => dataA,
      });

      messageBus.emit('registerGradeable', {
        id: 'b',
        dataVersion: '0.2',
        getGradeable: () => dataB,
      });

      const result = JSON.parse(gm.getGradeable());
      expect(result.data).toEqual({a: dataA, b: dataB});
      expect(result.meta.dataVersions).toEqual({a: '0.1', b: '0.2'});
    });

    it('emits a user warning and re-throws when a registrant callback throws', () => {
      messageBus.emit('registerGradeable', {
        id: 'a',
        dataVersion: '0.1',
        getGradeable: () => { throw new Error('In callback'); },
      });

      messageBus.on('warnUser', (type, error) => {
        expect(type).toEqual('getGradeableError');
        expect(error).toEqual(jasmine.any(Error));
      });

      expect(() => gm.getGradeable()).toThrowError(Error, 'In callback');
    });
  });
});
