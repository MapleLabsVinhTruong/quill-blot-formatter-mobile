// @flow

import BlotFormatter from '../BlotFormatter';
import Action from '../actions/Action';
import AlignAction from '../actions/align/AlignAction';
import ResizeAction from '../actions/ResizeAction';
import DeleteAction from '../actions/DeleteAction';
import DragAction from '../actions/DragAction';

export default class BlotSpec {
  formatter: BlotFormatter;

  constructor(formatter: BlotFormatter) {
    this.formatter = formatter;
  }

  init(): void {}

  getImageClickActions(): Class<Action>[] {
    return [ResizeAction, DeleteAction];
  }

  getDragableImageClickActions(): Class<Action>[] {
    return [DragAction, ResizeAction, DeleteAction];
  }

  getImageLongClickActions(): Class<Action>[] {
    return [AlignAction];
  }

  getDragableImageLongClickActions(): Class<Action>[] {
    return [DragAction, AlignAction];
  }

  getStickerActions(): Class<Action>[] {
    return [DragAction, ResizeAction, DeleteAction];
  }

  getTargetElement(): ?HTMLElement {
    return null;
  }

  getOverlayElement(): ?HTMLElement {
    return this.getTargetElement();
  }

  setSelection(): void {
    this.formatter.quill.setSelection(null);
  }

  onHide() {}
}
