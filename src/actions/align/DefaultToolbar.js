// @flow

import { Toolbar } from './Toolbar'
import { Aligner } from './Aligner'
import type { Alignment } from './Alignment'
import BlotFormatter from '../../BlotFormatter'

export default class DefaultToolbar implements Toolbar {
  toolbar: ?HTMLElement
  buttons: HTMLElement[]
  // originalLeft: Number
  // originalTop: Number

  constructor () {
    this.toolbar = null
    this.buttons = []
  }

  create (formatter: BlotFormatter, aligner: Aligner): HTMLElement {
    // const target = formatter.currentSpec.getTargetElement()
    // if (target) {
      // this.originalLeft = target.style.left
      // this.originalTop = target.style.top
      // console.log(`create ${this.originalLeft} - ${this.originalTop}`)
    // }

    const toolbar = document.createElement('div')
    toolbar.classList.add(formatter.options.align.toolbar.mainClassName)
    this.addToolbarStyle(formatter, toolbar)
    this.addButtons(formatter, toolbar, aligner)

    this.toolbar = toolbar
    return this.toolbar
  }

  destroy () {
    this.toolbar = null
    this.buttons = []
  }

  getElement (): ?HTMLElement {
    return this.toolbar
  }

  addToolbarStyle (formatter: BlotFormatter, toolbar: HTMLElement) {
    if (formatter.options.align.toolbar.mainStyle) {
      Object.assign(toolbar.style, formatter.options.align.toolbar.mainStyle)
    }
  }

  addButtonStyle (button: HTMLElement, index: number, formatter: BlotFormatter) {
    if (formatter.options.align.toolbar.buttonStyle) {
      Object.assign(button.style, formatter.options.align.toolbar.buttonStyle)
      if (index === 0) {
        button.style.borderTopLeftRadius = '12px'
        button.style.borderTopRightRadius = '12px'
      } else if (index === 3) {
        button.style.borderBottomLeftRadius = '12px'
        button.style.borderBottomRightRadius = '12px'
      }
    }
  }

  addButtons (formatter: BlotFormatter, toolbar: HTMLElement, aligner: Aligner) {
    aligner.getAlignments().forEach((alignment, i) => {
      const button = document.createElement('div')
      button.classList.add(formatter.options.align.toolbar.buttonClassName)
      button.innerHTML = alignment.name
      button.addEventListener('click', e => {
        formatter.selectedIndexAlignment = i;
        e.stopPropagation()
        this.onButtonClick(button, formatter, alignment, aligner, i)
        formatter.onAlignmentSelected();
      })
      this.addButtonStyle(button, i, formatter)
      toolbar.appendChild(button)
      if (formatter.selectedIndexAlignment === i){
        this.selectButton(formatter, button)
      }
    })
  }

  preselectButton (
    button: HTMLElement,
    alignment: Alignment,
    formatter: BlotFormatter,
    aligner: Aligner
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    if (aligner.isAligned(target, alignment)) {
      this.selectButton(formatter, button)
    }
  }

  onButtonClick (
    button: HTMLElement,
    formatter: BlotFormatter,
    alignment: Alignment,
    aligner: Aligner,
    index: Number,
  ) {
    if (!formatter.currentSpec) {
      return
    }

    const target = formatter.currentSpec.getTargetElement()
    if (!target) {
      return
    }

    this.clickButton(button, target, formatter, alignment, aligner, index)
  }

  clickButton (
    button: HTMLElement,
    alignTarget: HTMLElement,
    formatter: BlotFormatter,
    alignment: Alignment,
    aligner: Aligner,
    index: Number,
  ) {
    this.buttons.forEach(b => {
      this.deselectButton(formatter, b)
    })
    if (aligner.isAligned(alignTarget, alignment)) {
      if (formatter.options.align.toolbar.allowDeselect) {
        aligner.clear(alignTarget)
      } else {
        this.selectButton(formatter, button)
      }
    } else {
      this.selectButton(formatter, button)
      // if (index === 3){
      //   alignTarget.style.setProperty('left', `${this.originalLeft}`)
      //   alignTarget.style.setProperty('top', `${this.originalTop}`)
      // console.log(`select ${this.originalLeft} - ${this.originalTop}`)

      // }
      alignment.apply(alignTarget)
    }

    formatter.update()
  }

  selectButton (formatter: BlotFormatter, button: HTMLElement) {
    button.classList.add('is-selected')
    if (formatter.options.align.toolbar.addButtonSelectStyle) {
      button.style.setProperty('filter', 'invert(20%)');
    }
  }

  deselectButton (formatter: BlotFormatter, button: HTMLElement) {
    button.classList.remove('is-selected')
    if (formatter.options.align.toolbar.addButtonSelectStyle) {
      button.style.removeProperty('filter')
    }
  }
}
