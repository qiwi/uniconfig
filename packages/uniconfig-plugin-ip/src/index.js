// @flow

import type {
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'
import {address} from 'ip'

export default ({
  name: 'ip',
  handleSync(data: IAny): IAny {
    return address()
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(address())
  }
}: IPipe)
