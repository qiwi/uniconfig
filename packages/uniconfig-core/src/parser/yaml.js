// @flow

import {safeLoad} from 'js-yaml'
import type {IAny, IParser} from '../interface'

export default (function (data: string): IAny {
  return safeLoad(data)
}: IParser)
