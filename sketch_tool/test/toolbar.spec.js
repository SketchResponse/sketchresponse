import Toolbar from 'sketch2/toolbar';
import simulant from 'simulant';

describe('The toolbar', () => {
  let el, app;

  beforeEach(() => {
    el = document.createElement('menu');
    app = jasmine.createSpyObj('app', ['on', 'dispatch']);
  });

  it('is instantiated with a target element, app instance, and items list', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'ID'}
    ]);
    expect(tb instanceof Toolbar).toBe(true);
  });

  it('requires a first item with both a type and an ID', () => {
    expect(() => new Toolbar(el, app, [])).toThrowError(TypeError);
    expect(() => new Toolbar(el, app, [{type: 'button'}])).toThrowError(TypeError);
    expect(() => new Toolbar(el, app, [{id: 'ID'}])).toThrowError(TypeError);
  });

  it('renders a single button item', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'ID', icon: '//:0/icon', label: 'Button label'}
    ]);

    expect(el.querySelectorAll('.item > button').length).toEqual(1)
    expect(el.querySelector('.icon').src).toContain('//:0/icon');
    expect(el.querySelector('.label').innerHTML).toContain('Button label');
  });

  it('renders a separator', () => {
    const tb = new Toolbar(el, app, [
      {type: 'button', id: 'ID'},
      {type: 'separator'}
    ]);

    expect(el.querySelectorAll('hr').length).toEqual(1)
  });

  it('renders a splitbutton with an indicator after the label and a nested menu', () => {
    const tb = new Toolbar(el, app, [
      {type: 'splitbutton', id: 'ID', label: "Splitbutton label", items: [
        {id:'subID0', icon: '//:0/subicon0'},
        {id:'subID1', icon: '//:0/subicon1'},
        {id:'subID2', icon: '//:0/subicon2'},
      ]}
    ]);

    expect(el.querySelectorAll('.item .split-button-main').length).toEqual(1)
    expect(el.querySelectorAll('.item .split-button-aux').length).toEqual(1)
    expect(el.querySelector('.label').innerHTML).toMatch(/Splitbutton label\S+/);
    expect(el.querySelector('.dropdown').children.length).toEqual(3);

    for (let idx of [0, 1, 2]) {
      expect(el.querySelectorAll('.dropdown .icon')[idx].src).toContain(`//:0/subicon${idx}`);
    }
  });

  describe('splitbutton', () => {
    let tb;

    beforeEach(() => {
      tb = new Toolbar(el, app, [
        {type: 'splitbutton', id: 'ID', label: "Splitbutton label", items: [
          {id:'subID0', icon: '//:0/subicon0'},
          {id:'subID1', icon: '//:0/subicon1'},
          {id:'subID2', icon: '//:0/subicon2'},
        ]}
      ]);
    });

    it('dispatches an event to the app when the dropdown button is clicked', () => {
      simulant.fire(el.querySelector('.split-button-aux'), 'click');
      expect(app.dispatch.calls.count()).toEqual(1);
      expect(app.dispatch).toHaveBeenCalledWith('dropdown-open', 'ID');
    });

    it('changes "data-is-open" to "true" when opening the dropdown menu', () => {
      expect(el.querySelectorAll('[data-is-open="false"]').length).toEqual(1);
      tb.handleEvent({type: 'dropdown-open', id: 'ID'});
      expect(el.querySelectorAll('[data-is-open="true"]').length).toEqual(1);
    })

    it('changes "data-is-open" to "false" when a subitem is selected', () => {
      tb.handleEvent({type: 'tb-dropdown-open', id: 'ID'});
      tb.handleEvent({type: 'tb-dropdown-clicked', id: 'subID0'});
      expect(el.querySelectorAll('[data-is-open="false"]').length).toEqual(1);
    })
  });
});
