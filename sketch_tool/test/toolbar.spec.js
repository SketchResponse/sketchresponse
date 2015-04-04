import Toolbar from 'sketch2/toolbar';
import $ from 'jquery';

describe('The toolbar', () => {
  let target;

  beforeEach(() => {
    target = document.createElement('menu');
  });

  it('should be instantializable with a DOM element target and empty config', () => {
    let tb = new Toolbar(target, {});
    expect(tb).toEqual(jasmine.any(Toolbar));
    expect(target.className).toEqual('si-toolbar');
  });

  it('should add an `li.button` element when passed a config with an item of type `button`', () => {
    new Toolbar(target, {
      items: [
        { type: 'button' },
      ]
    });
    expect($(target).find('li.button').length).toEqual(1);
  });

});
