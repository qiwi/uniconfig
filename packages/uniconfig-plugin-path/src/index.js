// @flow

import rootPlugin from '@qiwi/uniconfig-plugin-root'
import path from 'path'
import type {
  IAny,
  IContext,
  IPipe,
  IPlugin
} from '../../uniconfig-core/src/interface'

export const ROOT_ALIASES = ['<root>', '$root', 'APP_ROOT']
export const resolveRoots = (args: IAny[]): IAny[] => args.map(arg => ROOT_ALIASES.includes(arg)
  ? rootPlugin.handleSync()
  : arg
)
export const name: string = 'path'

export const pipe: IPipe = {
  name,
  handleSync(data): IAny {
    let _data = data

    if (typeof data === 'string') {
      const re = new RegExp(`(${ROOT_ALIASES.join('|')})(?:/)?`, 'g')
      _data = data.split(re)
    }

    return path.resolve(...resolveRoots(_data && _data.data || _data))
  },
  handle(data): Promise<IAny> {
    return Promise.resolve(pipe.handleSync(data))
  }
}

export default ({
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
    context.pipe.add(rootPlugin.name, rootPlugin)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
    context.pipe.remove(rootPlugin.name)
  },
}: IPlugin)
