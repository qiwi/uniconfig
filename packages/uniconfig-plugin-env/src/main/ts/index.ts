import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'

export const name = 'env'

export const pipe: INamedPipe = {
  name,
  handleSync(): IAny {
    return process.env
  },
  handle(): Promise<IAny> {
    return Promise.resolve(process.env)
  },
}

export default pipe
