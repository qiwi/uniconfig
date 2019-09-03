import {IAny} from '../interface'

import {isNode, isBrowser} from 'browser-or-node'

export {get, has, each, reduce, mapValues, map} from 'lodash'

export {isBrowser, isNode}

export const echo = (data: IAny): IAny => data
