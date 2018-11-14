// @flow

import type {
  IAny,
  IContext,
  IPlugin,
  IPipe
} from '../../uniconfig-core/src/interface'

// $FlowFixMe
import requestSync from 'sync-request'
// $FlowFixMe
import requestAsync from 'then-request'

export const type = 'http'

export type IOpts = {
  [key: string]: IAny
}
// TODO Support axios format
export type IRequestOpts = {
  method: string,
  url: string,
  opts?: IOpts
}
const parseTarget = (target: string | IRequestOpts): IRequestOpts => {
  if (typeof target === 'string') {
    return {
      url: target,
      method: 'GET'
    }
  }

  return target
}

export const pipe: IPipe = {
  handleSync (target: string | IRequestOpts) {
    const {method, url, opts} = parseTarget(target)

    return requestSync(method, url, opts).getBody('utf8')
  },
  handle (target: string | IRequestOpts) {
    const {method, url, opts} = parseTarget(target)

    return requestAsync(method, url, opts).getBody('utf8')
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
