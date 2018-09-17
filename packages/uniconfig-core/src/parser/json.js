// @flow

import type { IAny, IParser } from '../interface'

export default ({
  parse (data: string): IAny {
    return JSON.parse(data)
  }
}: IParser)
