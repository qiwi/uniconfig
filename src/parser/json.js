// @flow

import type {IAny} from '../interface'

export default function (data: string): IAny {
  return JSON.parse(data)
}
