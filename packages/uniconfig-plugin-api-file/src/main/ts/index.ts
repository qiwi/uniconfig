import {
  IContext,
  IPlugin,
  IAny,
  IResolve,
  IReject,
  IPipe
} from '@qiwi/uniconfig-core'

export type IFsOpts = {
  encoding: string,
  flag?: string
}

export const DEFAULT_OPTS: IFsOpts = {
  encoding: 'utf8'
}

export const type = 'file'

export const pipe: IPipe = {
  handleSync (target: string, opts?: IFsOpts): IAny {
    return require('fs').readFileSync(target, processOpts(opts))
  },
  handle (target: string, opts?: IFsOpts): Promise<IAny> {
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

const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(type, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(type)
  },
}

export default plugin

export function processOpts (opts?: IFsOpts): IFsOpts {
  return { ...DEFAULT_OPTS, ...opts }
}
