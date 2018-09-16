import type { IAny, IApi } from '../interface'
import requestSync from 'sync-request'
import requestAsync from 'then-request'

export interface IHttpApi extends IApi {
  readSync (target: string, opts?: ?IAny): IAny,
  read (target: string, opts?: ?IAny): Promise<IAny>
}

export default ({
  readSync (target: string, opts?: ?IAny) {
    return requestSync('GET', target).getBody('utf8')
  },
  read (target: string, opts?: ?IAny) {
    return requestAsync('GET', target).getBody('utf8')
  }
}: IHttpApi)
