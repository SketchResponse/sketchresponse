import Toolbar from 'sketch2/toolbar';
import simulant from 'simulant';

describe('The toolbar', () => {
  let el, app;

  beforeEach(() => {
    el = document.createElement('menu');
    app = jasmine.createSpyObj('app', ['on', 'dispatch']);
  });

  it('is instantiated with a target element, app instance, and items list', () => {
    const tb = new Toolbar(el, app, []);
    expect(tb instanceof Toolbar).toBe(true);
  });

  it('renders a single button item', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'ID', icon: '//:0/icon', label: 'Button label'}
    ]);

    expect(el.querySelectorAll('li > .tb-button').length).toEqual(1)
    expect(el.querySelector('.tb-item').id).toEqual('ID')
    expect(el.querySelector('.tb-icon').src).toContain('//:0/icon');
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
        {id:'subID0', icon: '//:0/subicon0'},
        {id:'subID1', icon: '//:0/subicon1'},
        {id:'subID2', icon: '//:0/subicon2'},
      ]}
    ]);

    expect(el.querySelectorAll('li > .tb-split-button').length).toEqual(1)
    expect(el.querySelector('.tb-item').id).toEqual('ID')
    expect(el.querySelector('.tb-label').innerHTML).toMatch(/Splitbutton label\S+/);
    expect(el.querySelector('.tb-dropdown').children.length).toEqual(3);

    for (let idx of [0, 1, 2]) {
      expect(el.querySelectorAll('.tb-dropdown-item')[idx].id).toEqual(`subID${idx}`);
      expect(el.querySelectorAll('.tb-dropdown-icon')[idx].src).toContain(`//:0/subicon${idx}`);
    }
  });

  it('dispatches an event to the app with the id of any clicked button', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'ID0', icon: '//:0/icon0', label: 'Button label'},
      {type: 'splitbutton', id: 'ID1', label: "Splitbutton label", items: [
        {id:'subID', icon: '//:0/subicon'},
      ]}
    ]);

    const buttons = el.querySelectorAll('.tb-button, .tb-dropdown-button');
    simulant.fire(buttons[0], 'click');
    simulant.fire(buttons[1], 'click');
    simulant.fire(buttons[2], 'click');

    expect(app.dispatch.calls.count()).toEqual(3);
    expect(app.dispatch).toHaveBeenCalledWith('tb-clicked', 'ID0');
    expect(app.dispatch).toHaveBeenCalledWith('tb-clicked', 'ID1');
    expect(app.dispatch).toHaveBeenCalledWith('tb-dropdown-clicked', 'subID');
  });
});
