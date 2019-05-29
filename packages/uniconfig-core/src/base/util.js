// @flow

import type { IAny, IWindow } from '../interface'
export { get, has, each, reduce, mapValues, map } from 'lodash'

declare var window: IWindow

export function isBrowser (): boolean {
  try {
    const w: IWindow = window

    return typeof w !== 'undefined' && typeof w.document !== 'undefined'
  } catch (e) {
    return false
  }
}

export function echo (data: IAny): IAny { return data }
