// @flow

import { Aligner } from './Aligner'
import type { Alignment } from './Alignment'
import type { AlignOptions } from '../../Options'


const INLINE_WITH_TEXT = 'Inline with text'
const WRAP_TEXT = 'Wrap text'
const BREAK_TEXT = 'Break text'
const IN_FRONT_OF_TEXT = 'In front of text'

export default class DefaultAligner implements Aligner {
  alignments: { [string]: Alignment }
  alignAttribute: string
  applyStyle: boolean

  constructor (options: AlignOptions) {
    this.applyStyle = options.aligner.applyStyle
    this.alignAttribute = options.attribute
    this.alignments = {
      [INLINE_WITH_TEXT]: {
        name: INLINE_WITH_TEXT,
        apply: (el: HTMLElement) => {
          el.style.position = 'relative'
          el.style.setProperty('z-index', '0')
          el.style.setProperty('left', '')
          el.style.setProperty('top', '')
          this.setStyle(el, 'inline-block', null, '0px 6px 0px 6px')
        }
      },
      [WRAP_TEXT]: {
        name: WRAP_TEXT,
        apply: (el: HTMLElement) => {
          el.style.position = 'relative'
          el.style.setProperty('z-index', '0')
          el.style.setProperty('left', '')
          el.style.setProperty('top', '')
          el.style.setProperty('float', 'left')
          el.style.setProperty('margin', 'auto 16px auto auto')
          el.style.setProperty('display', 'inline')
        }
      },
      [BREAK_TEXT]: {
        name: BREAK_TEXT,
        apply: (el: HTMLElement) => {
          el.style.position = 'relative'
          el.style.setProperty('z-index', '0')
          el.style.setProperty('left', '')
          el.style.setProperty('top', '')
          this.setStyle(el, 'block', null, 'auto')
        }
      },
      [IN_FRONT_OF_TEXT]: {
        name: IN_FRONT_OF_TEXT,
        apply: (el: HTMLElement) => {
          this.setStyle(el, 'inline-block', null, '0px 6px 0px 6px') // reset position
          el.style.position = 'absolute'
          el.style.setProperty('float', null)
          el.style.setProperty('z-index', '1')
        }
      }
    }
  }

  getAlignments (): Alignment[] {
    return Object.keys(this.alignments).map(k => this.alignments[k])
  }

  clear (el: HTMLElement): void {
    el.removeAttribute(this.alignAttribute)
    this.setStyle(el, null, null, null)
  }

  isAligned (el: HTMLElement, alignment: Alignment): boolean {
    return el.getAttribute(this.alignAttribute) === alignment.name
  }

  setAlignment (el: HTMLElement, value: string) {
    el.setAttribute(this.alignAttribute, value)
  }

  setStyle (el: HTMLElement, display: ?string, float: ?string, margin: ?string) {
    if (this.applyStyle) {
      el.style.setProperty('display', display)
      el.style.setProperty('float', float)
      el.style.setProperty('margin', margin)
    }
  }
}
