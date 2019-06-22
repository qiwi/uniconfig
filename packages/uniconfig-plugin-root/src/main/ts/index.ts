import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'
import {path as ROOT} from 'app-root-path'

export const pipe: INamedPipe = {
  name: 'root',
  handleSync(): IAny {
    return ROOT
  },
  handle(): Promise<IAny> {
    return Promise.resolve(ROOT)
  },
}

export default pipe
