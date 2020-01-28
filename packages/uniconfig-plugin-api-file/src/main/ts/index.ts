import {
  IAny,
  IResolve,
  IReject,
  INamedPipe,
  IContext,
} from '@qiwi/uniconfig-core'

export type IFsOpts = {
  encoding: string,
  flag?: string
}

export const DEFAULT_OPTS: IFsOpts = {
  encoding: 'utf8',
}

export const processOpts = (opts?: IFsOpts): IFsOpts => ({...DEFAULT_OPTS, ...opts})

export const name = 'file'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, target: string, opts?: IFsOpts): IAny {
    return require('fs').readFileSync(target, processOpts(opts))
  },
  handle(_context: IContext, target: string, opts?: IFsOpts): Promise<IAny> {
    return new Promise((resolve: IResolve, reject: IReject): void => {
      require('fs').readFile(target, processOpts(opts), (err: IAny | null, data: IAny) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(data)
        }
      })
    })
  },
}

export default pipe
