// @flow

import Action from './Action'
import BlotFormatter from '../BlotFormatter'

export default class ResizeAction extends Action {
  bottomRightIcon: HTMLElement
  bottomRightHandle: HTMLElement
  dragHandle: ?HTMLElement
  dragStartX: number
  dragStartY: number
  preDragWidth: number
  targetRatio: number

  constructor (formatter: BlotFormatter) {
    super(formatter)
    this.bottomRightIcon = this.createResizeIcon('bottom-right', 'nwse-resize')
    this.bottomRightHandle = this.createHandle('bottom-right', 'nwse-resize')

    this.dragHandle = null
    this.dragStartX = 0
    this.dragStartY = 0
    this.preDragWidth = 0
    this.targetRatio = 0
  }

  onCreate () {
    this.formatter.overlay.appendChild(this.bottomRightIcon)
    this.formatter.overlay.appendChild(this.bottomRightHandle)
    this.repositionHandles(this.formatter.options.resize.handleStyle)
  }

  onDestroy () {
    this.setCursor('')
    this.formatter.overlay.removeChild(this.bottomRightIcon)
    this.formatter.overlay.removeChild(this.bottomRightHandle)
  }

  createHandle (position: string, cursor: string): HTMLElement {
    const box = document.createElement('div')
    box.classList.add(this.formatter.options.resize.handleClassName)
    box.setAttribute('data-position', position)
    box.style.cursor = cursor
    if (this.formatter.options.resize.handleStyle) {
      Object.assign(box.style, this.formatter.options.resize.handleStyle)
    }

    box.addEventListener('dragstart', () => false)
    box.addEventListener('pointerdown', this.onMouseDown, false)

    return box
  }

  createResizeIcon (position: string, cursor: string): HTMLElement {
    const box = document.createElement('div')
    box.classList.add(this.formatter.options.resize.handleClassName)
    box.setAttribute('data-position', position)
    box.style.cursor = cursor
    box.innerHTML = `
      <div style="border-radius:50%;background-color:white;">
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
      <defs>
      <clipPath id="clip1">
      <path d="M 12 0 C 18.628906 0 24 5.371094 24 12 C 24 18.628906 18.628906 24 12 24 C 5.371094 24 0 18.628906 0 12 C 0 5.371094 5.371094 0 12 0 Z M 12 0 "/>
      </clipPath>
      <clipPath id="clip2">
      <path d="M 5 4 L 20 4 L 20 19 L 5 19 Z M 5 4 "/>
      </clipPath>
      <clipPath id="clip3">
      <path d="M 12 0 C 18.628906 0 24 5.371094 24 12 C 24 18.628906 18.628906 24 12 24 C 5.371094 24 0 18.628906 0 12 C 0 5.371094 5.371094 0 12 0 Z M 12 0 "/>
      </clipPath>
      </defs>
      <g id="surface1">
      <g clip-path="url(#clip1)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:0.8;" d="M 12 0 C 18.628906 0 24 5.371094 24 12 C 24 18.628906 18.628906 24 12 24 C 5.371094 24 0 18.628906 0 12 C 0 5.371094 5.371094 0 12 0 Z M 12 0 "/>
      </g>
      <g clip-path="url(#clip2)" clip-rule="nonzero">
      <g clip-path="url(#clip3)" clip-rule="nonzero">
      <path style=" stroke:none;fill-rule:nonzero;fill:rgb(4.313725%,4.313725%,4.313725%);fill-opacity:1;" d="M 5.941406 5.726562 C 5.917969 5.253906 6.339844 4.832031 6.835938 4.882812 L 12.207031 5.082031 C 12.429688 5.105469 12.605469 5.179688 12.753906 5.328125 C 12.828125 5.402344 12.902344 5.480469 12.929688 5.601562 C 13.078125 5.902344 13.003906 6.273438 12.753906 6.523438 L 10.742188 8.488281 L 15.511719 13.257812 L 17.527344 11.296875 C 17.777344 11.046875 18.125 10.949219 18.421875 11.097656 C 18.546875 11.121094 18.621094 11.195312 18.695312 11.269531 C 18.84375 11.421875 18.945312 11.617188 18.96875 11.84375 L 19.167969 17.210938 C 19.191406 17.683594 18.769531 18.105469 18.296875 18.082031 L 12.929688 17.882812 C 12.703125 17.859375 12.480469 17.785156 12.332031 17.636719 C 12.257812 17.558594 12.207031 17.460938 12.183594 17.386719 C 12.058594 17.0625 12.132812 16.691406 12.355469 16.464844 L 14.34375 14.476562 L 9.570312 9.703125 L 7.582031 11.695312 C 7.359375 11.917969 7.011719 12.015625 6.6875 11.890625 C 6.589844 11.84375 6.488281 11.792969 6.390625 11.695312 C 6.242188 11.542969 6.167969 11.320312 6.140625 11.097656 Z M 5.941406 5.726562 "/>
      </g>
      </g>
      </g>
      </svg>
      </div>
  `
    if (this.formatter.options.resize.handleStyle) {
      Object.assign(box.style, this.formatter.options.resize.handleStyle)
    }

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

    Object.assign(this.bottomRightIcon.style, {
      right: handleXOffset,
      bottom: handleYOffset
    })
    Object.assign(this.bottomRightHandle.style, {
      right: handleXOffset,
      bottom: handleYOffset
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

  onMouseDown: (ev: PointerEvent) => void = (event: PointerEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return
    }
    this.dragHandle = event.target
    this.setCursor(this.dragHandle.style.cursor)

    if (!this.formatter.currentSpec) {
      return
    }

    const target = this.formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    const rect = target.getBoundingClientRect()

    this.dragStartX = event.clientX
    this.dragStartY = event.clientY

    this.preDragWidth = rect.width
    this.targetRatio = rect.height / rect.width

    document.addEventListener('pointermove', this.onDrag)
    document.addEventListener('pointerup', this.onMouseUp)
  }

  onDrag: (ev: PointerEvent) => void = (event: PointerEvent) => {
    if (!this.formatter.currentSpec) {
      return
    }

    const target = this.formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    const deltaX = event.clientX - this.dragStartX
    const deltaY = event.clientY - this.dragStartY

    if (this.dragHandle === this.bottomRightHandle) {
      let newWidth = 0
      newWidth = Math.round(this.preDragWidth + deltaX)
      const newHeight = this.targetRatio * newWidth

      target.setAttribute('width', `${newWidth}`)
      target.setAttribute('height', `${newHeight}`)

      this.formatter.update()
    }
  }

  onMouseUp: () => void = () => {
    this.setCursor('')
    document.removeEventListener('pointermove', this.onDrag)
    document.removeEventListener('pointerup', this.onMouseUp)
  }
}
