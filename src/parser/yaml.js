// @flow

import {safeLoad} from 'js-yaml'
import type {IAny} from '../interface'

export default function (data: string): IAny {
  return safeLoad(data)
}
