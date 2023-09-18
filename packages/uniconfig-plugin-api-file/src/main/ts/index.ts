import {
  IAny,
  IResolve,
  IReject,
  INamedPipe,
  IContext,
} from '@qiwi/uniconfig-core'
import {readFile, readFileSync, promises} from 'node:fs'

export type IFsOpts = {
  encoding: BufferEncoding,
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
          return readFileSync(path, processOpts(opts))
        }
        catch (e: any) {
          if (e.code !== 'ENOENT') {
            throw e
          }
        }
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
            resolve(await promises.readFile(path, processOpts(opts)))
            return
          }
          catch (e: any) {
            if (e.code !== 'ENOENT') {
              throw e
            }
          }
        }
        reject(new Error(`All targets are unreachable (${target})`))
        return
      }
      readFile(target, processOpts(opts), (err: IAny | null, data: IAny) => {
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
