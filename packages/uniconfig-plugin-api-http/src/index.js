import type {
  IAny,
  IContext,
  IPlugin,
  IPipe
} from '../../uniconfig-core/src/interface'

import requestSync from 'sync-request'
import requestAsync from 'then-request'

export const type = 'http'

export const pipe: IPipe = {
  handleSync (target: string, opts?: ?IAny) {
    return requestSync('GET', target).getBody('utf8')
  },
  handle (target: string, opts?: ?IAny) {
    return requestAsync('GET', target).getBody('utf8')
  }
}

export default ({
  rollup(context: IContext): void {
    context.pipe.add(type, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(type)
  },
}: IPlugin)
