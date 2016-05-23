import SketchInput from 'sketch2/main';

describe('The SketchInput class', () => {
  let el;

  beforeEach(() => {
    el = document.createElement('div');
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.parentNode.removeChild(el);
  });

  it('should be instantiated with a target element', () => {
    const si = new SketchInput(el);
    expect(si instanceof SketchInput).toBe(true);
  });

  it('throws TypeErrors if instantiated without a target element', () => {
    expect(() => new SketchInput()).toThrowError(TypeError);
    expect(() => new SketchInput({})).toThrowError(TypeError);
  });

  it('should create elements for the toolbar and sketch container', () => {
    const si = new SketchInput(el);
    expect(el.children[0].id).toEqual('si-toolbar');
    expect(el.children[1].id).toEqual('si-canvas');
  });
});
