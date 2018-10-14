// @flow

import type {IApi, IAny, IResolve, IReject, IContext, IPlugin} from '../../uniconfig-core/src/interface'
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

export const type = 'file'

export const api: IFileApi = {
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
}

export default ({
  rollup(context: IContext): void {
    context.api.add(type, api)
  },
  rollback(context: IContext): void {
    context.api.remove(type)
  },
}: IPlugin)

export function processOpts (opts?: ?IFsOpts): IFsOpts {
  return { ...DEFAULT_OPTS, ...opts }
}
