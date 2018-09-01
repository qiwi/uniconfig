// @flow

import type { IAny, IParser } from '../interface'

export default (function (data: string): IAny {
  return JSON.parse(data)
}: IParser)
