import {IAny} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => data

export const deepMasker = (keyCondition: (key: unknown) => boolean, fn: Function) => {
  return function deepMap(
    input: any,
    key: string | undefined = undefined,
    refs = new WeakMap(),
  ) {
    if (typeof input === 'object' && input !== null) {
      const ref = refs.get(input)
      if (ref) {
        return ref
      }
      const n = Array.isArray(input) ? [] : {}
      refs.set(input, n)
      for (const i in input) {
        if (input.hasOwnProperty(i)) {
          // @ts-ignore
          n[i] = deepMap(input[i], i, refs)
        }
      }
      return n
    }
    return keyCondition(key) ? fn(input) : input
  }
}
