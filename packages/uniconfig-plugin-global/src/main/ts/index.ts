import {
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'

// @ts-ignore
const GLOBAL: any = (() => globalThis || global || this || Function('return this')())()

const pipe: INamedPipe = {
  name: 'global',
  handleSync(): IAny {
    return GLOBAL
  },
  handle(): Promise<IAny> {
    return Promise.resolve(GLOBAL)
  }
}

export default pipe
