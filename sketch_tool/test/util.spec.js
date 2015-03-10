import * as util from 'sketch2/util';

describe(`An object observed with the 'observable' function`, () => {
  let obj, observer, observer2;

  beforeEach(() => {
    obj = {};
    observer = jasmine.createSpy();
    observer2 = jasmine.createSpy();

    // Make the object observable
    util.observable(obj);
  });

  it(`should contain 'on', 'off', and 'emit' methods`, () => {
    expect(obj.on).toEqual(jasmine.any(Function));
    expect(obj.off).toEqual(jasmine.any(Function));
    expect(obj.emit).toEqual(jasmine.any(Function));
  });

  it(`should call a listener added with 'on' when 'emit' is passed a matching event`, () => {
    obj.on('event', observer);
    obj.emit('event');

    expect(observer).toHaveBeenCalled();
  });

  it(`should not throw an error when emitting an event with no registered listeners`, () => {
    obj.emit('eventWithoutListeners');
  });

  it(`should not call listeners for the wrong events`, () => {
    obj.on('event', observer);
    obj.on('differentEvent', () => {});
    obj.emit('differentEvent');
    obj.emit('eventWithoutListeners');

    expect(observer).not.toHaveBeenCalled();
  });

  it(`should pass any arguments provided to 'emit' along to listeners`, () => {
    obj.on('event', observer);
    obj.emit('event', 'arg1', 2);

    expect(observer).toHaveBeenCalledWith('arg1', 2);
  });

  it(`should allow multiple listeners for a given event`, () => {
    obj.on('event', observer);
    obj.on('event', observer2);
    obj.emit('event');

    expect(observer).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
  });

  it(`should allow multiple events for a given listener`, () => {
    obj.on('event1', observer);
    obj.on('event2', observer);

    obj.emit('event1');
    expect(observer.calls.count()).toEqual(1);

    obj.emit('event2');
    expect(observer.calls.count()).toEqual(2);
  });

  it(`should not call a listener once it has been removed with the 'off' method`, () => {
    obj.on('event', observer);
    obj.off('event', observer);
    obj.emit('event');

    expect(observer).not.toHaveBeenCalled();
  });

  it(`should still call remanining listeners for an event after one has been removed`, () => {
    obj.on('event', observer);
    obj.on('event', observer2);
    obj.off('event', observer);
    obj.emit('event');

    expect(observer2).toHaveBeenCalled();
  });

  it(`should not have its observers overwritten if 'observable' is called on it again`, () => {
    obj.on('event', observer);
    util.observable(obj);
    obj.on('event', observer2);
    obj.emit('event');

    expect(observer).toHaveBeenCalled();
    expect(observer2).toHaveBeenCalled();
  });
});
