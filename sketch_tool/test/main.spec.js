import SketchInput from 'sketch2/main';

describe('The SketchInput class', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
  });

  it('should be instantiated with a target element', () => {
    const si = new SketchInput(el);
    expect(si instanceof SketchInput).toBe(true);
  });

  it('should create elements for the toolbar and sketch container', () => {
    const si = new SketchInput(el);
    expect(el.children[0].id).toEqual('si-toolbar');
    expect(el.children[1].id).toEqual('si-canvas');
  });
});
