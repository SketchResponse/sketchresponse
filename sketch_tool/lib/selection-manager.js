import * as attrCache from './util/dom-attr-cache';
import { injectStyleSheet } from './util/dom-style-helpers';

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
injectStyleSheet(`
  [${ SELECTED_ATTR }='default'] { opacity: 0.5;}
  [${ SELECTED_ATTR }='override'] { opacity: 0.5 !important;}
`,
);

export default class SelectionManager {
  constructor(rootElement, messageBus) {
    this.rootElement = rootElement;
    this.selectMode = false;
    messageBus.on('enableSelectMode', () => {this.setSelectMode(true);});
    messageBus.on('disableSelectMode', () => {this.setSelectMode(false);});
    messageBus.on('deselectAll', () => {this.deselectAll();});
    messageBus.on('deleteSelected', () => {this.deleteSelected();});
    this.messageBus = messageBus;
  }

  setSelectMode(selectMode) {
    this.selectMode = selectMode;
    if (!this.selectMode) {
      this.deselectAll();
    }
  }
  select(element, mode) {
    attrCache.setAttributeNS(element, null, SELECTED_ATTR, mode === 'override' ? 'override' : 'default');
  }
  deselect(element) { attrCache.removeAttributeNS(element, null, SELECTED_ATTR); }
  isSelected(element) {return attrCache.getAttributeNS(element, null, SELECTED_ATTR) !== null; }

  toggleSelected(element, mode) {
    const condition = !this.isSelected(element);  // toggle current value
    if (condition) this.select(element, mode);
    else this.deselect(element);
  }

  // Expensive; call circumspectly
  getSelected() { return Array.from(this.rootElement.querySelectorAll(`[${ SELECTED_ATTR }]`)); }

  // Expensive; call circumspectly
  deselectAll() { this.getSelected().forEach((element) => this.deselect(element)); }

  deleteSelected() {
    let elWasDeleted = false;
    this.getSelected().forEach((element) => {
      const elementClasses = element.getAttribute('class').split(' ');
      if (elementClasses.indexOf('point') !== -1) {
        this.messageBus.emit(
          'addPoint',
          elementClasses[1].substring(10),
          parseInt(elementClasses[2].substring(12)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('horizontal-line') !== -1) {
        this.messageBus.emit(
          'addHorizontalLine',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('vertical-line') !== -1) {
        this.messageBus.emit(
          'addVerticalLine',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('line-segment') !== -1) {
        this.messageBus.emit(
          'addLineSegment',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('line-segment-point') !== -1) {
        this.messageBus.emit(
          'addLineSegmentPoint',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(10)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('freeform') !== -1) {
        this.messageBus.emit(
          'addFreeform',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('stamp') !== -1) {
        this.messageBus.emit(
          'addStamp',
          elementClasses[1].substring(10),
          parseInt(elementClasses[2].substring(12)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('polyline') !== -1) {
        this.messageBus.emit(
          'addPolyline',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
      else if (elementClasses.indexOf('spline') !== -1) {
        this.messageBus.emit(
          'addSpline',
          elementClasses[2].substring(10),
          parseInt(elementClasses[0].substring(8)),
        );
        elWasDeleted = true;
      }
    });
    this.messageBus.emit('deletePoints');
    this.messageBus.emit('deleteHorizontalLines');
    this.messageBus.emit('deleteVerticalLines');
    this.messageBus.emit('deleteLineSegments');
    this.messageBus.emit('deleteLineSegmentPoints');
    this.messageBus.emit('deleteFreeforms');
    this.messageBus.emit('deleteStamps');
    this.messageBus.emit('deletePolylines');
    this.messageBus.emit('deleteSplines');
    this.deselectAll();
    if (elWasDeleted) {
      this.messageBus.emit('deleteFinished');
    }
  }
}
