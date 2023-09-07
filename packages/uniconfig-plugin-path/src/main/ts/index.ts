import * as path from 'path'
import rootPlugin from '@qiwi/uniconfig-plugin-root'
import pkgPathPlugin from '@qiwi/uniconfig-plugin-pkg-path'
import {
  IAny,
  IContext,
  INamedPipe,
  IPlugin,
} from '@qiwi/uniconfig-core'

export const ROOT_ALIASES = ['<root>', '$root', 'APP_ROOT']
export const PKG_PATH_ALIASES = ['<pkg-path>', '$pkg-path', 'APP_PKG']
export const resolvePaths = (context: IContext, args: IAny[]): IAny[] => args.map(arg => {
  if (ROOT_ALIASES.includes(arg)) {
    return rootPlugin.handleSync(context)
  }
  else if (PKG_PATH_ALIASES.includes(arg)) {
    return pkgPathPlugin.handleSync(context)
  }
  else {
    return arg
  }
})

export const name: string = 'path'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, data): IAny {
    let _data = data

    if (typeof data === 'string') {
      const re = new RegExp(`(${ROOT_ALIASES.join('|')}|${PKG_PATH_ALIASES.join('|')})(?:/)?`, 'g')
      _data = data.split(re)
    }

    return path.resolve(...resolvePaths(_context,_data && _data.data || _data))
  },
  handle(_context: IContext, data): Promise<IAny> {
    return Promise.resolve(pipe.handleSync(_context, data))
  },
}

export const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
    context.pipe.add(rootPlugin.name, rootPlugin)
    context.pipe.add(pkgPathPlugin.name, pkgPathPlugin)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
    context.pipe.remove(rootPlugin.name)
    context.pipe.remove(pkgPathPlugin.name)
  },
}

export default plugin
