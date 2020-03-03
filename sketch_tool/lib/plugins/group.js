import Freeform from './freeform';
import HorizontalLine from './horizontal-line';
import LineSegment from './line-segment';
import Point from './point';
import Polyline from './polyline';
import Spline from './spline';
import Stamp from './stamp';
import VerticalLine from './vertical-line';
import { validate } from '../config-validator';

export const VERSION = '0.1';

export default class Group {
  constructor(params, app) {
    if (app.debug) {
      if (typeof params.label !== 'string') {
        params.label = 'Group'; // Default value
      }
      if (!validate(params, 'group')) {
        console.log('The group config has errors, using default values instead');
      }
    }
    this.params = params;
    this.app = app;
    const items = [];
    const plugins = this.params.plugins.map(pluginParams => pluginParams.name);
    plugins.forEach((name, index) => {
      this.params.plugins[index].isSubItem = true;
      const plugin = this.createPlugin(name, this.params.plugins[index], this.app);
      items.push(plugin.menuItem);
    });
    this.menuItem = {
      type: 'splitbutton',
      id: this.params.id,
      items: items,
      name: this.params.name,
      label: this.params.label,
      icon: items[0].icon,
      color: items[0].color,
    }
    this.app.registerToolbarItem(this.menuItem);
  }

  createPlugin(name, params, app) {
    switch (name) {
      case 'freeform':
        return new Freeform(params, app);
        break;
      case 'horizontal-line':
        return new HorizontalLine(params, app);
        break;
      case 'line-segment':
        return new LineSegment(params, app);
        break;
      case 'point':
        return new Point(params, app);
        break;
      case 'polyline':
        return new Polyline(params, app);
        break;
      case 'spline':
        return new Spline(params, app);
        break;
      case 'stamp':
        return new Stamp(params, app);
        break;
      case 'vertical-line':
        return new VerticalLine(params, app);
        break;
    }
  }
}
