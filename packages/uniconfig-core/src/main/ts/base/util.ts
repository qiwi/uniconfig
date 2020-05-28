import {IAny} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => data

const deepMap = (() => {
  const getSameTypeOfObject = (input: any) => Array.isArray(input) ? [] : {}

  const _deepMap = (
    cb: Function,
    input: any,
    key?: string,
    path?: string,
    target = input,
    refs = new WeakMap(),
  ) => {
    if (typeof cb !== 'function') {
      return input
    }

    if (typeof input !== 'object' || input === null) {
      return cb(input, key, target, path)
    }

    const ref = refs.get(input)
    if (ref) {
      return ref
    }

    const acc = getSameTypeOfObject(input)
    refs.set(input, acc)

    Object.keys(input).forEach((key) => {
      // @ts-ignore
      acc[key] = _deepMap(
        cb,
        input[key],
        key,
        (path ? path + '.' : '') + key,
        input,
        refs,
      )
    })

    return acc
  }

  return (input: any, cb: Function) => _deepMap(cb, input)
})()

const maskerFn = (value: any, _key: string, _target: any, path: string) => {
  const list = [
    'secret',
    'password',
    'token',
    'cred',
    'credentials',
    'pass',
  ]

  if(path === undefined) {
    return value
  }

  const chunks = path.split('.')

  if (chunks.some((r: string) => list.some(el => r.includes(el)))) {
    const len = !value
      ? 'empty'
      : value.toString().length

    return `***** {${len}}`
  }

  return value
}

export const secretMasker = (input: any) => deepMap(input, maskerFn)
