import * as attrCache from './util/dom-attr-cache';
import { injectStyleSheet, injectSVGDefs } from './util/dom-style-helpers';

// Note: data-* attributes are not officially supported in SVG 1.1 (without namespaces),
// but they still seem to have widespread browser support and are a bit cleaner to deal with
// if we ever have to tag both HTML and SVG elements
export const SELECTED_ATTR = 'data-si-selected';

// Inject stylesheet and filter on module load since we only need one each per window
// injectStyleSheet(`[${ SELECTED_ATTR }] { filter: url(#si-selected-filter); }`);
// injectSVGDefs(`
//   <filter id="si-selected-filter" x="-2" y="-2" width="5" height="5">
//     <feMorphology in="SourceAlpha" operator="dilate" radius="5"/>
//     <feColorMatrix type="matrix" values="
//       0 0 0 0 0
//       0 0 0 0 0
//       0 0 0 0 0
//       0 0 0 0.15 0
//     " />
//     <feComposite in="SourceGraphic" />
//   </filter>
// `);
injectStyleSheet(`[${ SELECTED_ATTR }] { opacity: 0.5;}`);

export default class SelectionManager {
  constructor(rootElement, messageBus) {
    this.rootElement = rootElement;
    this.selectMode = false;
    messageBus.on('enableSelectMode', () => {this.setSelectMode(true);});
    messageBus.on('disableSelectMode', () => {this.setSelectMode(false);});
    messageBus.on('deselectAll', () => {this.deselectAll()});
  }

  setSelectMode(selectMode) {
    this.selectMode = selectMode;
    if (!this.selectMode) {
      this.deselectAll();
    }
  }
  select(element) { attrCache.setAttributeNS(element, null, SELECTED_ATTR, ''); }
  deselect(element) { attrCache.removeAttributeNS(element, null, SELECTED_ATTR); }
  isSelected(element) {return attrCache.getAttributeNS(element, null, SELECTED_ATTR) !== null; }

  toggleSelected(element, condition) {
    if (arguments.length < 2) condition = !this.isSelected(element);  // toggle current value
    if (condition) this.select(element);
    else this.deselect(element);
  }

  // Expensive; call circumspectly
  getSelected() { return Array.from(this.rootElement.querySelectorAll(`[${ SELECTED_ATTR }]`)); }

  // Expensive; call circumspectly
  deselectAll() { this.getSelected().forEach(element => this.deselect(element)); }
}
