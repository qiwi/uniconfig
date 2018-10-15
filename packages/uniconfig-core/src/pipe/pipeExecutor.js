import {
  IPipe,
  IPipeline,
  IPipeRef,
  IPipeOpts,
  IPipeChain,
  IMode,
  IAny,
  IRegistry
} from '../interface'
import { reduce } from '../base/util'
import pipeRegistry from '../pipe/pipeRegistry'

export const PIPE_SEPARATOR = '>'
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

export default function executor (data: IAny, pipeline: IPipeline, mode: IMode, registry?: IRegistry = pipeRegistry) {
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
      name,
      pipe: registry.get(name),
      opts
    }))
}

export function normalizePipeline (pipeline: IPipeline): INormalizedPipe {
  const pipes = typeof pipeline === 'string'
    ? pipeline.split(PIPE_SEPARATOR)
    : pipeline

  return normalizePipeChain(pipes)
}

export function normalizePipeChain (pipeline: IPipeChain): INormalizedPipe[] {
  return pipeline
    .map(item => {
      if (typeof item === 'string') {
        return {
          name: item,
          opts: []
        }
      }

      if (Array.isArray(item)) {
        const [name, ...opts] = item
        return {
          name,
          opts
        }
      }
    })
}
