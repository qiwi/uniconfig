// @flow

import type {
  IContext,
  IPlugin,
  IPipe,
  IPipeline,
  IAny
} from '../../uniconfig-core/src/interface'

import { get, map, reduce, mapValues } from 'lodash-es'
import { pipeExecutor } from '@qiwi/uniconfig-core'

export const type = 'datatree'

export type ISource = {
  data: IAny,
  pipeline: IPipeline
}
export type IDatatree = {
  data: IAny,
  sources: {
    [key: string]: ISource
  }
}

export type ISourceMap = {
  [key: string]: IAny
}

export const evaluate = (data: IAny, sources: ISourceMap) => reduce(
  data,
  (result: ISourceMap, value: IAny, key: string) => {
    if (/^\$.+:.*/.test(value)) {
      const [sourceName, path] = value.slice(1).split(':')
      const source = sources[sourceName]

      if (source) {
        result[key] = path
          ? get(source, path)
          : source
      } else {
        // TODO Throw error
      }
    } else {
      result[key] = value
    }

    return result
  },
  {}
)

export const pipe: IPipe = {
  handleSync(input: IDatatree, opts: IAny): IAny {
    const {sources = {}, data} = input

    return evaluate(data, mapValues(sources, ({data, pipeline}) => {
      return pipeExecutor(data, pipeline, 'sync')
    }))
  },

  async handle(input: IDatatree): Promise<IAny> {
    const {sources = {}, data} = input
    const pairs = map(sources, ({data, pipeline}, key) => ({
      key,
      promise: pipeExecutor(data, pipeline, 'async')
    }))

    return Promise
      .all(pairs.map(({promise}) => promise))
      .then((resolved): ISourceMap => reduce(
        pairs,
        (m: ISourceMap, {key}, i: number) => {
          m[key] = resolved[i]
          return m
        },
        {}
      ))
      .then(sources => evaluate(data, sources))
  }
}

export default ({
  rollup(context: IContext): void {
    context.pipe.add(type, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(type)
  },
}: IPlugin)