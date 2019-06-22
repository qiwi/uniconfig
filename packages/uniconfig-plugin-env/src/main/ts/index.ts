import {
  IContext,
  IPlugin,
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'

const name = 'env'

export const pipe: INamedPipe = {
  name,
  handleSync(): IAny {
    return process.env
  },
  handle(): Promise<IAny> {
    return Promise.resolve(process.env)
  }
}

export const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
  },
}

export default plugin
