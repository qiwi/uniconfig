import {IAny} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => data

const getSameTypeOfObject = (input: {} | []) => Array.isArray(input) ? [] : {}

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

  const acc = getSameTypeOfObject(input)
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

const maskerFn = (el: any) => {
  if (!el) {
    return '{empty value}'
  }

  const length = el.toString().length
  return length < 7 ? ''.padEnd(length, '*') : `*******...{${length}}`
}

const maskerCondition = (el?: string): boolean => {
  const keywords = [
    'secret',
    'password',
    'token',
    'cred',
    'credentials',
    'pass',
  ]

  if (el === undefined) {
    return false
  }

  return keywords.some((keyword) => el.toLowerCase().includes(keyword))
}

export const secretDeepMasker = (input: any) => {
  return deepMasker(input, undefined, maskerFn, maskerCondition)
}
