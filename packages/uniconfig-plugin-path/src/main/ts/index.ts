import * as path from 'path'
import rootPlugin from '@qiwi/uniconfig-plugin-root'
import {
  IAny,
  IContext,
  INamedPipe,
  IPlugin,
} from '@qiwi/uniconfig-core'

export const ROOT_ALIASES = ['<root>', '$root', 'APP_ROOT']
export const CWD_ALIASES = ['<cwd>', '$cwd', 'CWD']

export const resolveAliases = (context: IContext, args: IAny[]): IAny[] => args.map(arg => ROOT_ALIASES.includes(arg)
    ? rootPlugin.handleSync(context)
    : CWD_ALIASES.includes(arg)
      ? process.cwd()
      : arg,
)
export const name: string = 'path'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, data): IAny {
    let _data = data

    if (typeof data === 'string') {
      const re = new RegExp(`(${[...ROOT_ALIASES, ...CWD_ALIASES].join('|')})(?:/)?`, 'g')
      _data = data.split(re)
    }

    if (Array.isArray(data) && data.every(Array.isArray)) {
      return data.map((it: string[]) => path.resolve(...resolveAliases(_context, it)))
    }

    return path.resolve(...resolveAliases(_context,_data && _data.data || _data))
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
