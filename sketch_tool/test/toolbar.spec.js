import Toolbar from 'sketch2/toolbar';
import $ from 'jquery';

describe('The toolbar', () => {
  let target;

  beforeEach(() => {
    target = document.createElement('div');
  });

  it('should be instantializable with a DOM element target and config array', () => {
    let tb = new Toolbar(target, {items: []});
    expect(tb).toEqual(jasmine.any(Toolbar));
  });

  it('should add a `.foo` element when passed a config with an item of type `foo`', () => {
    new Toolbar(target, {
      items: [
        { type: 'foo' },
      ]
    });
    expect($(target).find('.foo').length).toEqual(1);
  });

  it('should add multiple elements with classes matching their types', () => {
    new Toolbar(target, {
      items: [
        { type: 'foo' },
        { type: 'bar' },
        { type: 'bar' },
        { type: 'baz' },
        { type: 'foo' },
      ]
    });

    // Todo: refactor...
    let classNames = $(target).children().toArray().map((el) => el.className);
    expect(classNames).toEqual(['foo', 'bar', 'bar', 'baz', 'foo']);
  });
});
