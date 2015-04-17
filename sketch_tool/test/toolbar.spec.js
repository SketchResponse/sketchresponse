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
    const items = [
      {type: 'button', id: 'testID', icon: 'data:test', label: 'Test label'}
    ];
    const tb = new Toolbar(el, app, items);
    expect(el.children.length).toBe(1);
    expect(el.children[0].nodeName.toLowerCase()).toEqual('li');
    expect(el.querySelector('button').id).toEqual('testID')
    expect(el.querySelector('.tb-icon').src).toContain('data:test');
    expect(el.querySelector('.tb-label').innerHTML).toContain('Test label');
  });

  it('renders a separator', () => {
    const items = [
      {type: 'separator'}
    ];
    const tb = new Toolbar(el, app, items);
    expect(el.querySelectorAll('li > hr').length).toEqual(1)
  });

  it('renders a splitbutton with an indicator after the label and a nested menu', () => {
    const items = [
      {type: 'splitbutton', id: 'testID', label: "Test label", items: [
        {id:'subID1', icon: 'data:test1'},
        {id:'subID2', icon: 'data:test2'},
        {id:'subID3', icon: 'data:test3'},
      ]}
    ];
    const tb = new Toolbar(el, app, items);

    expect(el.querySelector('.tb-label').innerHTML).toMatch(/Test label\S+/);
    expect(el.querySelector('.tb-dropdown').children.length).toEqual(3);

    for (let item of items[0].items) {
      expect(el.querySelector(`#${item.id} img`).src).toContain(item.icon);
    }
  });
});
