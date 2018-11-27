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

const pathPlugin: IPipe = {
  name,
  handleSync(data): IAny {
    return path.resolve(...resolveRoots(data && data.data || data))
  },
  handle(data): Promise<IAny> {
    return Promise.resolve(path.resolve(...resolveRoots(data && data.data || data)))
  }
}

export default ({
  rollup(context: IContext): void {
    context.pipe.add(name, pathPlugin)
    context.pipe.add(rootPlugin.name, rootPlugin)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
    context.pipe.remove(rootPlugin.name)
  },
}: IPlugin)
