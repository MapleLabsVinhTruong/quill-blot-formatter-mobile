// @flow

import BlotSpec from './BlotSpec'
import BlotFormatter from '../BlotFormatter'

const longClickDuration = 600

export default class ImageSpec extends BlotSpec {
  img: ?HTMLElement

  timer = null
  longClickInProgress = false

  constructor (formatter: BlotFormatter) {
    super(formatter)
    this.img = null
  }

  init () {
    this.formatter.quill.root.addEventListener('click', this.onClick)

    this.formatter.quill.root.addEventListener('pointerdown', event => {
      this.timer = setTimeout(() => {
        this.longClickInProgress = true
        this.onLongClick(event)
      }, longClickDuration)
    })

    this.formatter.quill.root.addEventListener('mouseleave', event => {
      clearTimeout(this.timer)
      if (this.longClickInProgress) {
        this.longClickInProgress = false
      }
    })
  }

  getTargetElement (): ?HTMLElement {
    return this.img
  }

  onHide () {
    this.img = null
  }

  onLongClick: (event: PointerEvent) => void = (event: PointerEvent) => {
    const el = event.target
    if (!(el instanceof HTMLElement) || el.tagName !== 'IMG') {
      return
    }
    this.img = el
    const customTag = el.dataset.customTag
    if (customTag === 'IMAGE') {
      this.formatter.onImageLongClick(this)
    }
  }

  onClick: (event: PointerEvent) => void = (event: PointerEvent) => {
    clearTimeout(this.timer)
    if (this.longClickInProgress) {
      this.longClickInProgress = false
      return
    }
    const el = event.target
    if (!(el instanceof HTMLElement) || el.tagName !== 'IMG') {
      return
    }

    this.img = el
    const customTag = el.dataset.customTag
    if (customTag === 'STICKER') {
      this.img.style.setProperty('z-index', '21')
      this.formatter.onStickerClick(this)
    } else {
      this.formatter.onImageClick(this)
    }
  }
}
