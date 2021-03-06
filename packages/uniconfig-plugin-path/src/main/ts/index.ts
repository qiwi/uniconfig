import * as path from 'path'
import rootPlugin from '@qiwi/uniconfig-plugin-root'
import {
  IAny,
  IContext,
  INamedPipe,
  IPlugin,
} from '@qiwi/uniconfig-core'

export const ROOT_ALIASES = ['<root>', '$root', 'APP_ROOT']
export const resolveRoots = (context: IContext, args: IAny[]): IAny[] => args.map(arg => ROOT_ALIASES.includes(arg)
  ? rootPlugin.handleSync(context)
  : arg,
)
export const name: string = 'path'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, data): IAny {
    let _data = data

    if (typeof data === 'string') {
      const re = new RegExp(`(${ROOT_ALIASES.join('|')})(?:/)?`, 'g')
      _data = data.split(re)
    }

    return path.resolve(...resolveRoots(_context,_data && _data.data || _data))
  },
  handle(_context: IContext, data): Promise<IAny> {
    return Promise.resolve(pipe.handleSync(_context, data))
  },
}

export const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
    context.pipe.add(rootPlugin.name, rootPlugin)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
    context.pipe.remove(rootPlugin.name)
  },
}

export default plugin
