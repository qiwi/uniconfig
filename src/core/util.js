// @flow

import type {IAny, IWindow} from '../interface'

declare var window: IWindow

export {get, has} from 'lodash-es'

export function isBrowser (): boolean {
  try {
    const w: IWindow = window

    return typeof w !== 'undefined' && typeof w.document !== 'undefined'
  } catch (e) {
    return false
  }
}

export function echo (data: IAny): IAny { return data }
