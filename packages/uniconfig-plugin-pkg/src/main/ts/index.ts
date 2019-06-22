import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'
import * as read from 'read-pkg'

export const pipe: INamedPipe = {
  name: 'pkg',
  handleSync(): IAny {
    return read.sync()
  },
  handle(): Promise<IAny> {
    return read()
  },
}

export default pipe
