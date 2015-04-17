import Toolbar from 'sketch2/toolbar';

// from http://stackoverflow.com/a/5775621/1974654
const NULL_SRC = '//:0';

describe('The toolbar', () => {
  let el, app;

  beforeEach(() => {
    el = document.createElement('menu');
    app = jasmine.createSpy('app');
  });

  it('should be instantiated with a target element, app instance, and items list', () => {
    const tb = new Toolbar(el, app, []);
    expect(tb instanceof Toolbar).toBe(true);
  });

  it('should render a single button item', () => {
    const items = [
      {type: 'button', id: 'testID', icon: NULL_SRC, label: 'Test label'}
    ];
    const tb = new Toolbar(el, app, items);
    expect(el.children.length).toBe(1);
    expect(el.children[0].nodeName.toLowerCase()).toEqual('li');
    expect(el.querySelector('button').id).toEqual(items[0].id)
    expect(el.querySelector('.tb-icon').src).toContain(items[0].icon);
    expect(el.querySelector('.tb-label').innerHTML).toContain(items[0].label);
  });

  it('should render a separator', () => {
    const items = [
      {type: 'separator'}
    ];
    const tb = new Toolbar(el, app, items);
    expect(el.querySelectorAll('li > hr').length).toEqual(1)
  });

});
