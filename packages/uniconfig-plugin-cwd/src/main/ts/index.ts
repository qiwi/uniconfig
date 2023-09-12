import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'

export const pipe: INamedPipe = {
  name: 'cwd',
  handleSync(): IAny {
    return process.cwd()
  },
  handle(): Promise<IAny> {
    return Promise.resolve(process.cwd())
  },
}

export default pipe
