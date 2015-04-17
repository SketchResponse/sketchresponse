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
      {type: 'button', id: 'ID', icon: 'data:icon', label: 'Button label'}
    ]);

    expect(el.querySelectorAll('li > .tb-button').length).toEqual(1)
    expect(el.querySelector('.tb-button').id).toEqual('ID')
    expect(el.querySelector('.tb-icon').src).toContain('data:icon');
    expect(el.querySelector('.tb-label').innerHTML).toContain('Button label');
  });

  it('renders a separator', () => {
    const tb = new Toolbar(el, app, [
      {type: 'separator'}
    ]);

    expect(el.querySelectorAll('li > hr').length).toEqual(1)
  });

  it('renders a splitbutton with an indicator after the label and a nested menu', () => {
    const tb = new Toolbar(el, app, [
      {type: 'splitbutton', id: 'ID', label: "Splitbutton label", items: [
        {id:'subID0', icon: 'data:subicon0'},
        {id:'subID1', icon: 'data:subicon1'},
        {id:'subID2', icon: 'data:subicon2'},
      ]}
    ]);

    expect(el.querySelectorAll('li > .tb-split-button').length).toEqual(1)
    expect(el.querySelector('.tb-split-button').id).toEqual('ID')
    expect(el.querySelector('.tb-label').innerHTML).toMatch(/Splitbutton label\S+/);
    expect(el.querySelector('.tb-dropdown').children.length).toEqual(3);

    for (let idx of [0, 1, 2]) {
      expect(el.querySelectorAll('.tb-dropdown-button')[idx].id).toEqual(`subID${idx}`);
      expect(el.querySelectorAll('.tb-dropdown-icon')[idx].src).toEqual(`data:subicon${idx}`);
    }
  });
});
