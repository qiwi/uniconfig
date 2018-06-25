// @flow

import type {ILoader, IAny, IResolve, IReject} from '../interface'
export type IFsOpts = {
  encoding: string,
  flag?: string
}

export const DEFAULT_OPTS: IFsOpts = {
  encoding: 'utf8'
}

export default ({
  sync (target: string, opts?: IFsOpts): IAny {
    return require('fs').readFileSync(target, processOpts(opts))
  },
  async (target: string, opts?: IFsOpts): Promise<IAny> {
    return new Promise((resolve: IResolve, reject: IReject): void => {
      require('fs').readFile(target, processOpts(opts), (err: IAny, data: IAny) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}: ILoader)

function processOpts (opts?: IFsOpts): IFsOpts {
  return {...DEFAULT_OPTS, ...opts}
}
