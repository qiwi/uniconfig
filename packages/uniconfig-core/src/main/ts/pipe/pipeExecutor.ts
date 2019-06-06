import type {
  IPipe,
  IPipeline,
  IPipeRef,
  IPipeRefExt,
  IPipeLink,
  IPipeOpts,
  IPipeChain,
  IMode,
  IAny,
  IRegistry
} from '../interface'
import { reduce } from '../base/util'
import pipeRegistry from '../pipe/pipeRegistry'

export const PIPE_SEPARATOR = /[\s\r\n]*>+[\s\r\n]*/
export const DEFAULT_PIPE: IPipe = {
  handle (data) { return Promise.resolve(data) },
  handleSync (data) { return data }
}

export type INormalizedPipe = {
  name: IPipeRef,
  opts: IPipeOpts[]
}

export type IResolvedPipe = {
  pipe: IPipe,
  opts: IPipeOpts[]
}

export default function executor (data: IAny, pipeline: IPipeline, mode: IMode, registry?: IRegistry = pipeRegistry): IAny | Promise<IAny> {
  const resolvedPipes = resolvePipeline(pipeline, registry)

  if (mode === 'async') {
    return reduce(
      resolvedPipes,
      (promise, { pipe: { handle }, opts }) => promise.then(data => handle(data, ...opts)),
      Promise.resolve(data)
    )
  }

  return reduce(
    resolvedPipes,
    (prev, { pipe: { handleSync }, opts }) => handleSync(prev, ...opts),
    data
  )
}

export function resolvePipeline (pipeline?: IPipeline, registry: IRegistry): IResolvedPipe[] {
  if (!pipeline) {
    return [{
      pipe: DEFAULT_PIPE,
      opts: []
    }]
  }

  return normalizePipeline(pipeline)
    .map(({ name, opts }) => ({
      pipe: getPipe(name, registry),
      opts
    }))
}

export function getPipe (name: string, registry: IRegistry): IPipe {
  const pipe = registry.get(name)

  if (!pipe) {
    throw new Error(`Pipe not found: ${name}`)
  }

  return pipe
}

export function normalizePipeline (pipeline: IPipeline): INormalizedPipe[] {
  const pipes = typeof pipeline === 'string'
    ? pipeline.trim().split(PIPE_SEPARATOR)
    : pipeline

  return normalizePipeChain(pipes)
}

export function normalizePipeChain (pipeline: Array<IPipeRef> | IPipeChain): INormalizedPipe[] {
  return pipeline
    .map((item: IPipeLink) => {
      if (typeof item === 'string') {
        return {
          name: item,
          opts: []
        }
      }

      const [name, ...opts] = (item: IPipeRefExt)
      return {
        name,
        opts: [...opts]
      }
    })
}
