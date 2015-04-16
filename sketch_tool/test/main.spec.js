import SketchInput from 'sketch2/main';

describe('The SketchInput class', () => {

  it('should be instantiated with a target element', () => {
    const el = document.createElement('div');
    const si = new SketchInput(el);
    expect(si.el).toBe(el);
  });

  it('should create elements for the toolbar and sketch container', () => {
    const el = document.createElement('div');
    const si = new SketchInput(el);

    expect(el.children[0].id).toEqual('si-toolbar');
    expect(el.children[1].id).toEqual('si-canvas');
  });
});
