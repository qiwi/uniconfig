import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'
import {address} from 'ip'

export const pipe: INamedPipe = {
  name: 'ip',
  handleSync(): IAny {
    return address()
  },
  handle(): Promise<IAny> {
    return Promise.resolve(address())
  },
}

export default pipe
