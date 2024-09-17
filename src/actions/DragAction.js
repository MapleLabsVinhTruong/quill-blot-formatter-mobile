// @flow

import Action from './Action'
import BlotFormatter from '../BlotFormatter'

export default class DragAction extends Action {
  dragOverlay: ?HTMLElement
  dragStartX: number
  dragStartY: number
  targetX: number
  targetY: number
  differenceTop: number
  differenceLeft: number

  constructor (formatter: BlotFormatter) {
    super(formatter)
    this.dragOverlay = this.createDragOverlay('nwse-resize')
    this.dragStartX = 0
    this.dragStartY = 0
    this.targetX = 0
    this.targetY = 0
    this.differenceTop = 0
    this.differenceLeft = 0
  }

  onCreate () {
    this.formatter.overlay.appendChild(this.dragOverlay)
  }

  onDestroy () {
    this.setCursor('')
    this.formatter.overlay.removeChild(this.dragOverlay)
  }

  createDragOverlay (cursor: string): HTMLElement {
    const box = document.createElement('div')
    box.style.cursor = cursor
    Object.assign(box.style, {
      position: 'absolute',
      height: '100%',
      width: '100%',
      backgroundColor: 'transparent',
      boxSizing: 'border-box',
      touchAction: 'none'
    })

    box.addEventListener('dragstart', () => false)
    box.addEventListener('pointerdown', this.onMouseDown, false)

    return box
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
    this.targetX = rect.left 
    this.targetY = rect.top 
    this.differenceTop = rect.top - target.offsetTop
    this.differenceLeft = rect.left - target.offsetLeft
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
    target.style.left = `${this.targetX + deltaX - this.differenceLeft}px`
    target.style.top = `${this.targetY + deltaY - this.differenceTop}px`
    this.formatter.update()
  }

  onMouseUp: () => void = () => {
    this.setCursor('')
    document.removeEventListener('pointermove', this.onDrag)
    document.removeEventListener('pointerup', this.onMouseUp)
  }
}
