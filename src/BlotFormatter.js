// @flow

import deepmerge from 'deepmerge';
import type { Options } from './Options';
import DefaultOptions from './Options';
import Action from './actions/Action';
import BlotSpec from './specs/BlotSpec';

const dontMerge = (destination: Array<any>, source: Array<any>) => source;

export default class BlotFormatter {
  quill: any;
  options: Options;
  currentSpec: ?BlotSpec;
  specs: BlotSpec[];
  overlay: HTMLElement;
  actions: Action[];
  isStep2: Boolean;

  constructor(quill: any, options: $Shape<Options> = {}) {
    this.quill = quill;
    this.options = deepmerge(DefaultOptions, options, { arrayMerge: dontMerge });
    this.currentSpec = null;
    this.actions = [];
    this.overlay = document.createElement('div');    
    this.overlay.classList.add(this.options.overlay.className);
    this.overlay.onkeydown = ev => ev.preventDefault();
    if (this.options.overlay.style) {
      Object.assign(this.overlay.style, this.options.overlay.style);
    }

    // disable native image resizing on firefox
    document.execCommand('enableObjectResizing', false, 'false'); // eslint-disable-line no-undef
    this.quill.root.parentNode.style.position = this.quill.root.parentNode.style.position || 'relative';

    this.quill.root.addEventListener('click', this.onClick);
    this.specs = this.options.specs.map((SpecClass: Class<BlotSpec>) => new SpecClass(this));
    this.specs.forEach(spec => spec.init());
  }

  showImageFormatter(spec: BlotSpec) {
    this.overlay.style.setProperty('z-index', '2')
    this.overlay.addEventListener('click',this.onOverlayClick);
    this.currentSpec = spec;
    this.currentSpec.setSelection();
    this.setUserSelect('none');
    this.quill.root.parentNode.appendChild(this.overlay);
    this.repositionOverlay();
    this.createImageStep1Actions(spec);
  }

  showStickerFormatter(spec: BlotSpec) {
    this.overlay.style.setProperty('z-index', '21')
    this.currentSpec = spec;
    this.currentSpec.setSelection();
    this.setUserSelect('none');
    this.quill.root.parentNode.appendChild(this.overlay);
    this.repositionOverlay();
    this.createStickerActions(spec);
  }

  hide() {
    if (!this.currentSpec) {
      return;
    }
    this.isStep2 = false;
    this.overlay.removeEventListener('click', this.onOverlayClick);
    this.currentSpec.onHide();
    this.currentSpec = null;
    this.quill.root.parentNode.removeChild(this.overlay);
    this.overlay.style.setProperty('display', 'none');
    this.setUserSelect('');
    this.destroyActions();
  }

  onOverlayClick: () => void = () => {
    if (this.isStep2 === true){
      this.hide();
    } else {
      this.destroyActions();
      this.createImageStep2Actions();
    }
  }

  update() {
    this.repositionOverlay();
    this.actions.forEach(action => action.onUpdate());
  }

  createImageStep1Actions(spec: BlotSpec) {
    this.actions = spec.getImageStep1Actions().map((ActionClass: Class<Action>) => {
      const action: Action = new ActionClass(this);
      action.onCreate();
      return action;
    });
  }

  createImageStep2Actions() {
    this.isStep2 = true;
    this.actions = this.currentSpec.getImageStep2Actions().map((ActionClass: Class<Action>) => {
      const action: Action = new ActionClass(this);
      action.onCreate();
      return action;
    });
  }

  createStickerActions(spec: BlotSpec) {
    this.actions = spec.getStickerActions().map((ActionClass: Class<Action>) => {
      const action: Action = new ActionClass(this);
      action.onCreate();
      return action;
    });
  }

  destroyActions() {
    this.actions.forEach((action: Action) => action.onDestroy());
    this.actions = [];
  }

  repositionOverlay() {
    if (!this.currentSpec) {
      return;
    }

    const overlayTarget = this.currentSpec.getOverlayElement();
    if (!overlayTarget) {
      return;
    }

    const parent: HTMLElement = this.quill.root.parentNode;
    const specRect = overlayTarget.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();

    Object.assign(this.overlay.style, {
      display: 'block',
      left: `${specRect.left - parentRect.left - 1 + parent.scrollLeft}px`,
      top: `${specRect.top - parentRect.top + parent.scrollTop}px`,
      width: `${specRect.width}px`,
      height: `${specRect.height}px`,
    });
  }

  setUserSelect(value: string) {
    const props: string[] = [
      'userSelect',
      'mozUserSelect',
      'webkitUserSelect',
      'msUserSelect',
    ];

    props.forEach((prop: string) => {
      // set on contenteditable element and <html>
      this.quill.root.style.setProperty(prop, value);
      if (document.documentElement) {
        document.documentElement.style.setProperty(prop, value);
      }
    });
  }

  onClick: () => void = () => {
    this.hide();
  }
}
