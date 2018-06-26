// @flow

import type {IApi, IAny, IResolve, IReject} from '../interface'
export type IFsOpts = {
  encoding: string,
  flag?: string
}

export interface IFileApi extends IApi {
  readSync (target: string, opts?: ?IFsOpts): IAny,
  read (target: string, opts?: ?IFsOpts): Promise<IAny>
}

export const DEFAULT_OPTS: IFsOpts = {
  encoding: 'utf8'
}

export default ({
  readSync (target: string, opts?: ?IFsOpts): IAny {
    return require('fs').readFileSync(target, processOpts(opts))
  },
  read (target: string, opts?: ?IFsOpts): Promise<IAny> {
    return new Promise((resolve: IResolve, reject: IReject): void => {
      require('fs').readFile(target, processOpts(opts), (err: IAny | null, data: IAny) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
}: IFileApi)

function processOpts (opts?: ?IFsOpts): IFsOpts {
  return {...DEFAULT_OPTS, ...opts}
}
