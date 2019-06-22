import {
  IContext,
  IPlugin,
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'

export const name = 'json'

export const parse = (data: string): IAny => JSON.parse(data)

export const pipe: INamedPipe = {
  name,
  handleSync(data: IAny): IAny {
    return parse(data)
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  }
}

const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
  },
}

export default plugin
