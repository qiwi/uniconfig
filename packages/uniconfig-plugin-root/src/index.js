// @flow

import type {
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'
import {path as ROOT} from 'app-root-path'

export default ({
  name: 'root',
  handleSync(data: IAny): IAny {
    return ROOT
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(ROOT)
  }
}: IPipe)
