import {
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'

import * as yargs from 'yargs'

export const pipe: INamedPipe = {
  name: 'argv',
  handleSync(): IAny {
    return yargs.argv
  },
  handle(): Promise<IAny> {
    return Promise.resolve(yargs.argv)
  }
}

export default pipe
