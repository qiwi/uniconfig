import {
  IPipeline,
  IAny,
  IAnyObject,
  INamedPipe,
  pipeExecutor,
  SYNC,
  ASYNC,
  IContext,
} from '@qiwi/uniconfig-core'

import {get, map, reduce, mapValues, forEach, keys, isArray, isObject} from 'lodash'

export const name = 'datatree'

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

const compact = (object: {[key: string]: IAny}, separator: string = '.') => {
  const paths: IAnyObject = {}
  const process = (branch: any, path: string) => {
    isObject(branch) && keys(branch).length > 0 || isArray(branch) ?
      forEach(branch, (value, name) => {
        process(value, path + separator + name)
      }) :
      (paths[path] = branch)
  }
  forEach(object, process)

  return paths
}

export const evaluate = (data: IAny, sources: ISourceMap) => reduce(
  data,
  (result: ISourceMap, value: IAny, key: string) => {
    switch (true) {
      case typeof value === 'string' && /^\$.+:.*/.test(value):
        const [sourceName, path] = value.slice(1).split(':')
        const source = sources[sourceName]

        if (source) {
          result[key] = path
            ? source[path] || get(source, path) || get(compact(source), path)
            : source
        }
        else {
          // TODO Throw error
        }
        break

      case typeof value === 'object':
        result[key] = evaluate(value, sources)

        break

      default:
        result[key] = value
    }

    return result
  },
  Array.isArray(data) ? [] : {},
)

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, input: IDatatree): IAny {
    const {sources = {}, data} = input

    return evaluate(data, mapValues(sources, ({data, pipeline}) => {
      return pipeExecutor(data, pipeline, SYNC, _context)
    }))
  },

  async handle(_context: IContext, input: IDatatree): Promise<IAny> {
    const {sources = {}, data} = input
    const pairs = map(sources, ({data, pipeline}, key) => ({
      key,
      promise: pipeExecutor(data, pipeline, ASYNC, _context),
    }))

    return Promise
      .all(pairs.map(({promise}) => promise))
      .then((resolved): ISourceMap => reduce(
        pairs,
        (m: ISourceMap, {key}, i: number) => {
          m[key] = resolved[i]
          return m
        },
        {},
      ))
      .then(sources => evaluate(data, sources))
  },
}

export default pipe
