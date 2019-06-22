import {
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'
import read, {sync as readSync} from 'read-pkg'

export const pipe: INamedPipe = {
  name: 'pkg',
  handleSync(): IAny {
    return readSync()
  },
  handle(): Promise<IAny> {
    return read()
  }
}

export default pipe
