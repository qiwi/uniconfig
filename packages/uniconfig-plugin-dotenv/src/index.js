// @flow

import type {
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'
import {parse} from 'dotenv'

export const name = 'dotenv'

export default ({
  name,
  handleSync(data: IAny): IAny {
    return parse(data)
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  }
}: IPipe)
