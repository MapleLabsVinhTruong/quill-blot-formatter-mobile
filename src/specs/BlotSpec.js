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

  getImageStep1Actions(): Class<Action>[] {
    return [ResizeAction, DeleteAction];
  }

  getImageStep2Actions(): Class<Action>[] {
    return [AlignAction, DeleteAction];
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
