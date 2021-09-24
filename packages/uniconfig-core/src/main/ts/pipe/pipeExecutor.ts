import {
  IPipe,
  IPipeline,
  IPipeRef,
  IPipeRefExt,
  IPipeLink,
  IPipeOpts,
  IMode,
  IAny,
  IRegistry,
  IContext,
} from '../interface'

import {reduce, secretMasker} from '../base/util'
import {ASYNC} from '../constants'
export const PIPE_SEPARATOR = /[\s\r\n]*>+[\s\r\n]*/
export const DEFAULT_PIPE: IPipe = {
  handle(_context: IContext, data) {
    return Promise.resolve(data)
  },
  handleSync(_context: IContext, data) {
    return data
  },
}

export type INormalizedPipe = {
  name: IPipeRef,
  opts: IPipeOpts[]
}

export type IResolvedPipe = {
  pipe: IPipe,
  opts: IPipeOpts[]
}

export const invokePipe = (
  mode: IMode,
  {
    name,
    handle,
    handleSync,
  }: IPipe,
  context: IContext,
  data: any,
  opts: any[],
) => {
  const handleException = (e: any, name: any, data: any, opts: any[]) => {
    console.error('Pipe exec failure', 'name=', name, 'data=', JSON.stringify(secretMasker(data)) , 'opts=', JSON.stringify(secretMasker(opts)))
    console.error(e)
    throw e
  }

  try {
    return mode === ASYNC
      ? handle(context, data, ...opts).catch((e: any) => handleException(e, name, data, opts))
      : handleSync(context, data, ...opts)

  } catch (e) {
    handleException(e, name, data, opts)
  }
}

export default function executor(data: IAny, pipeline: IPipeline, mode: IMode, context: IContext): IAny | Promise<IAny> {
  const resolvedPipes = resolvePipeline(pipeline, context.pipe)

  if (mode === ASYNC) {
    return reduce(
      resolvedPipes,
      (promise, {pipe, opts}) => promise.then(data => invokePipe(mode, pipe, context, data, opts)),
      Promise.resolve(data),
    )
  }

  return reduce(
    resolvedPipes,
    (prev, {pipe, opts}) => invokePipe(mode, pipe, context, prev, opts),
    data,
  )
}

export function resolvePipeline(pipeline?: IPipeline, registry?: IRegistry): IResolvedPipe[] {
  if (!pipeline || !registry) {
    return [{
      pipe: DEFAULT_PIPE,
      opts: [],
    }]
  }

  return normalizePipeline(pipeline)
    .map(({name, opts}) => ({
      pipe: getPipe(name, registry),
      opts,
    }))
}

export function getPipe(name: string, registry: IRegistry): IPipe {
  const pipe = registry.get(name)

  if (!pipe) {
    throw new Error(`Pipe not found: ${name}`)
  }

  return pipe
}

export function normalizePipeline(pipeline: IPipeline): INormalizedPipe[] {
  const pipes = typeof pipeline === 'string'
    ? pipeline.trim().split(PIPE_SEPARATOR)
    : pipeline

  return normalizePipeChain(pipes)
}

export function normalizePipeChain(pipeline: Array<IPipeRef | IPipeRefExt | IPipeLink>): INormalizedPipe[] {
  return pipeline
    .map((item: IPipeLink) => {
      if (typeof item === 'string') {
        return {
          name: item,
          opts: [],
        }
      }

      const [name, ...opts] = item
      return {
        name,
        opts: [...opts],
      }
    })
}
