import Toolbar from 'sketch2/toolbar';

describe('The toolbar', () => {
  let el, app;

  beforeEach(() => {
    el = document.createElement('menu');
    app = jasmine.createSpy('app');
  });

  it('is instantiated with a target element, app instance, and items list', () => {
    const tb = new Toolbar(el, app, []);
    expect(tb instanceof Toolbar).toBe(true);
  });

  it('renders a single button item', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'testID', icon: 'data:test', label: 'Test label'}
    ]);
    expect(el.children.length).toBe(1);
    expect(el.children[0].nodeName.toLowerCase()).toEqual('li');
    expect(el.querySelector('button').id).toEqual('testID')
    expect(el.querySelector('.tb-icon').src).toContain('data:test');
    expect(el.querySelector('.tb-label').innerHTML).toContain('Test label');
  });

  it('renders a separator', () => {
    const tb = new Toolbar(el, app, [
      {type: 'separator'}
    ]);
    expect(el.querySelectorAll('li > hr').length).toEqual(1)
  });

  it('renders a splitbutton with an indicator after the label and a nested menu', () => {
    const tb = new Toolbar(el, app, [
      {type: 'splitbutton', id: 'testID', label: "Test label", items: [
        {id:'subID0', icon: 'data:test0'},
        {id:'subID1', icon: 'data:test1'},
        {id:'subID2', icon: 'data:test2'},
      ]}
    ]);

    expect(el.querySelector('.tb-label').innerHTML).toMatch(/Test label\S+/);
    expect(el.querySelector('.tb-dropdown').children.length).toEqual(3);

    for (let idx of [0, 1, 2]) {
      expect(el.querySelectorAll('.tb-dropdown-button')[idx].id).toEqual(`subID${idx}`);
      expect(el.querySelectorAll('.tb-dropdown-icon')[idx].src).toEqual(`data:test${idx}`);
    }
  });
});
