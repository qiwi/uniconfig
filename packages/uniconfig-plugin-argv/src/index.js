// @flow

import type {
  IPipe,
  IAny
} from '../../uniconfig-core/src/interface'

import yargs from 'yargs'

export default ({
  name: 'argv',
  handleSync(data: IAny): IAny {
    return yargs.argv
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(yargs.argv)
  }
}: IPipe)
