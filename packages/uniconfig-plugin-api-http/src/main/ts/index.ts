import {
  IAny, IContext,
  INamedPipe,
} from '@qiwi/uniconfig-core'

import requestAsync from 'then-request'

export type IMethod = 'GET' | 'POST' | 'HEAD' | 'PUT' | 'DELETE' | 'OPTIONS' | 'TRACE' | 'PATCH'

export const name = 'http'

export type IOpts = {
  [key: string]: IAny
}
// TODO Support axios format
export type IRequestOpts = {
  method: IMethod,
  url: string,
  opts?: IOpts
}
const parseTarget = (target: string | IRequestOpts): IRequestOpts => {
  if (typeof target === 'string') {
    return {
      url: target,
      method: 'GET',
    }
  }

  return target
}

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, target: string | IRequestOpts) {
    const {method, url, opts} = parseTarget(target)

    // sync-request calls sync-rpc on top level which spawns unnecessary process in ASYNC mode
    // https://github.com/ForbesLindesay/sync-request/blob/master/src/index.ts#L8
    // https://github.com/ForbesLindesay/sync-rpc/blob/f500876453721b37376419ad855388aae0579ccf/lib/index.js#L173
    return require('sync-request')(method, url, opts).getBody('utf8')
  },
  handle(_context: IContext, target: string | IRequestOpts) {
    const {method, url, opts} = parseTarget(target)

    return requestAsync(method, url, opts).getBody('utf8')
  },
}

export default pipe
