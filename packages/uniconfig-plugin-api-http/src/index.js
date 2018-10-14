import type {IApi, IAny, IContext, IPlugin} from '../../uniconfig-core/src/interface'

import requestSync from 'sync-request'
import requestAsync from 'then-request'

export interface IHttpApi extends IApi {
  readSync (target: string, opts?: ?IAny): IAny,
  read (target: string, opts?: ?IAny): Promise<IAny>
}

export const type = 'http'

export const api: IHttpApi = {
  readSync (target: string, opts?: ?IAny) {
    return requestSync('GET', target).getBody('utf8')
  },
  read (target: string, opts?: ?IAny) {
    return requestAsync('GET', target).getBody('utf8')
  }
}

export default ({
  rollup(context: IContext): void {
    context.api.add(type, api)
  },
  rollback(context: IContext): void {
    context.api.remove(type)
  },
}: IPlugin)
