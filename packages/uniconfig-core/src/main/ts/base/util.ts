import {IAny, IWindow} from '../interface'
export {get, has, each, reduce, mapValues, map} from 'lodash'

declare var window: IWindow

export const isBrowser = (): boolean => {
  try {
    const w: IWindow = window
    return typeof w !== 'undefined' && typeof w.document !== 'undefined'

  }
  catch (e) {
    return false
  }
}

export const echo = (data: IAny): IAny => {
  return data
}
