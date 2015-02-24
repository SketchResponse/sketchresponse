import { x } from 'lib/main';
import default_export from 'lib/main';
import * as mod from 'lib/main';
import * as mod2 from 'sketch2/main';

console.log('Hello from main.spec.js');

describe('The main module', () => {
  it('should export a variable "x" equal to 42', () => {
    expect(x).toBe(42);
  });

  it('should be importable via the System loader', (done) => {
    System.import('lib/main').then((test_mod) => {
      expect(test_mod).toBe(mod);
      done();
    });
  });

  it('should export a function as its default which returns "x"', () => {
    expect(default_export).toEqual(jasmine.any(Function));

    let test_x = default_export();
    expect(test_x).toBe(x);
  });

  it('is apparently imported again when using a different path', () => {
    expect(mod2).not.toBe(mod);
    expect(mod2.uniqueString).toEqual(mod.uniqueString);
  })
});
