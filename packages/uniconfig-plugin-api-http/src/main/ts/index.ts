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
    const requestSync = require('sync-request')

    return requestSync(method, url, opts).getBody('utf8')
  },
  handle(_context: IContext, target: string | IRequestOpts) {
    const {method, url, opts} = parseTarget(target)

    return requestAsync(method, url, opts).getBody('utf8')
  },
}

export default pipe
