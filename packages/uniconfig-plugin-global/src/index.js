// @flow

import type {
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'

// $FlowFixMe
const GLOBAL = (() => this || Function('return this')())()

export default ({
  name: 'global',
  handleSync(): IAny {
    return GLOBAL
  },
  handle(): Promise<IAny> {
    return Promise.resolve(GLOBAL)
  }
}: IPipe)
