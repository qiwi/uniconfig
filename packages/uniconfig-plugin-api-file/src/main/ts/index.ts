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
  handleSync(_context: IContext, target: string | string[], opts?: IFsOpts): IAny {
    if (Array.isArray(target)) {
      for (const path of target) {
        try {
          return require('fs').readFileSync(path, processOpts(opts))
        }
        catch { /* noop */ }
      }
      throw new Error(`All targets are unreachable (${target})`)
    }
    return require('fs').readFileSync(target, processOpts(opts))
  },
  handle(_context: IContext, target: string | string[], opts?: IFsOpts): Promise<IAny> {
    return new Promise(async(resolve: IResolve, reject: IReject) => {
      if (Array.isArray(target)) {
        for (const path of target) {
          try {
            resolve(await require('fs/promises').readFile(path, processOpts(opts)))
            return
          }
          catch (e) { /* noop */ }
        }
        reject(new Error(`All targets are unreachable (${target})`))
        return
      }
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
