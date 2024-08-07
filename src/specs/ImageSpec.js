// @flow

import BlotSpec from './BlotSpec';
import BlotFormatter from '../BlotFormatter';

export default class ImageSpec extends BlotSpec {
  img: ?HTMLElement;

  constructor(formatter: BlotFormatter) {
    super(formatter);
    this.img = null;
  }

  init() {
    this.formatter.quill.root.addEventListener('click', this.onClick);
  }

  getTargetElement(): ?HTMLElement {
    return this.img;
  }

  onHide() {
    this.img = null;
  }

  onClick: (event: PointerEvent) => void = (event: PointerEvent) => {
    const el = event.target;
    if (!(el instanceof HTMLElement) || el.tagName !== 'IMG') {
      return;
    }

    this.img = el;
    const customTag = el.dataset.customTag;
    if (customTag === 'STICKER'){
      this.img.style.setProperty('z-index', '21')
      this.formatter.showStickerFormatter(this);
    } else {
      this.formatter.showImageFormatter(this);
    }
  };
}
