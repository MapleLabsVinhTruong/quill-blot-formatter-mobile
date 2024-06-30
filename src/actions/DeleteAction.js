// @flow

import Quill from 'quill';
import Action from './Action';

export default class DeleteAction extends Action {
  topLeftHandle: HTMLElement

  constructor (formatter: BlotFormatter) {
    super(formatter)
    this.topLeftHandle = this.createDeleteButton()
  }

  onCreate() {
    this.formatter.overlay.appendChild(this.topLeftHandle)
    this.repositionHandles(this.formatter.options.resize.handleStyle)
    document.addEventListener('keyup', this.onKeyUp, true);
    this.formatter.quill.root.addEventListener('input', this.onKeyUp, true);
  }

  onDestroy() {
    this.setCursor('')
    this.formatter.overlay.removeChild(this.topLeftHandle)
    document.removeEventListener('keyup', this.onKeyUp);
    this.formatter.quill.root.removeEventListener('input', this.onKeyUp);
  }

  createDeleteButton(): HTMLElement {
    const box = document.createElement('div')
    box.classList.add(this.formatter.options.resize.handleClassName)
    box.setAttribute('data-position', 'top-left')
    box.innerHTML = `
      <div style="border-radius:50%;background-color:white;">
        <?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
        <g id="surface1">
        <path style=" stroke:none;fill-rule:nonzero;fill:rgb(52.941179%,52.941179%,52.941179%);fill-opacity:1;" d="M 0 12 C 0 5.390625 5.34375 0 12 0 C 18.609375 0 24 5.390625 24 12 C 24 18.65625 18.609375 24 12 24 C 5.34375 24 0 18.65625 0 12 Z M 8.203125 9.796875 L 10.40625 12 L 8.203125 14.203125 C 7.734375 14.671875 7.734375 15.375 8.203125 15.796875 C 8.625 16.265625 9.328125 16.265625 9.75 15.796875 L 11.953125 13.59375 L 14.203125 15.796875 C 14.625 16.265625 15.328125 16.265625 15.75 15.796875 C 16.21875 15.375 16.21875 14.671875 15.75 14.203125 L 13.546875 12 L 15.75 9.796875 C 16.21875 9.375 16.21875 8.671875 15.75 8.203125 C 15.328125 7.78125 14.625 7.78125 14.203125 8.203125 L 11.953125 10.453125 L 9.75 8.203125 C 9.328125 7.78125 8.625 7.78125 8.203125 8.203125 C 7.734375 8.671875 7.734375 9.375 8.203125 9.796875 Z M 8.203125 9.796875 "/>
        </g>
        </svg>
        </div>
      `

    if (this.formatter.options.resize.handleStyle) {
      Object.assign(box.style, this.formatter.options.resize.handleStyle)
    }

    box.addEventListener('click', () => {
      const blot = Quill.find(this.formatter.currentSpec.getTargetElement())
      if (blot) {
        blot.deleteAt(0)
      }
      this.formatter.hide()
    })

    return box
  }

  repositionHandles (handleStyle: ?{ width: string, height: string }) {
    let handleXOffset = '0px'
    let handleYOffset = '0px'
    if (handleStyle) {
      if (handleStyle.width) {
        handleXOffset = `${-parseFloat(handleStyle.width) / 2}px`
      }
      if (handleStyle.height) {
        handleYOffset = `${-parseFloat(handleStyle.height) / 2}px`
      }
    }

    Object.assign(this.topLeftHandle.style, {
      left: handleXOffset,
      top: handleYOffset
    })
    
  }

  setCursor (value: string) {
    if (document.body) {
      document.body.style.cursor = value
    }

    if (this.formatter.currentSpec) {
      const target = this.formatter.currentSpec.getOverlayElement()
      if (target) {
        target.style.cursor = value
      }
    }
  }

  onKeyUp: (ev: KeyboardEvent) => void = (e: KeyboardEvent) => {
    if (!this.formatter.currentSpec) {
      return;
    }

    // delete or backspace
    if (e.keyCode === 46 || e.keyCode === 8) {
      const blot = Quill.find(this.formatter.currentSpec.getTargetElement());
      if (blot) {
        blot.deleteAt(0);
      }
      this.formatter.hide();
    }
  };
}
