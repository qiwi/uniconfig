import {IAny, IEnvType} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => {
  return data
}

export const assertEnvType = (env?: IEnvType) => {
  if (!env) {
    return
  }

  if (env === IEnvType.BROWSER && !isBrowser) {
    return
  }

  throw new Error(`Uniconfig plugin requires ${env} env only`)
}
