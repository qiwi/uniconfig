import {IAny} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => data

export const deepMasker = (
  input: any,
  key: string | undefined,
  fn: Function,
  condition: Function,
  refs = new WeakMap(),
) => {
  if (typeof input !== 'object' || input === null) {
    return condition(key) ? fn(input) : input
  }

  const ref = refs.get(input)
  if (ref) {
    return ref
  }

  const acc = Array.isArray(input) ? [] : {}
  refs.set(input, acc)
  const keys = Object.keys(input)
  keys.forEach((key) => {
    // @ts-ignore
    acc[key] = deepMasker(
      input[key],
      key,
      fn,
      condition(key) ? () => true : condition,
      refs,
    )
  })
  return acc
}

export const secretDeepMasker = (input: any) => {
  const keywords = ['secret', 'password', 'token', 'cred', 'credentials', 'pass']
  const condition = (el?:string) => el !== undefined && keywords.some(keyword => el.toLowerCase().includes(keyword))
  const fn = (el:any) => {
    if(el === undefined) {
      return 'empty value'
    }
    const length = el.toString().length
    return length < 7 ? ''.padEnd(length, '*') : `*******...{${length}}`
  }

  return deepMasker(input, undefined, fn, condition)
}
