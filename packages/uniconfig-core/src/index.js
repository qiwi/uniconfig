// @flow

/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import type {IConfig, IConfigOpts, IConfigInput, IPipe, IPlugin} from './interface'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

export const context = createContext()

/**
 * Config factory.
 * @param {IConfigInput} input
 * @param {Object} opts
 * @returns {Config}
 */
export function factory(input: IConfigInput, opts: IConfigOpts): IConfig {
  return new Config(input, opts)
}

export {
  Config,
  pipeExecutor
}

export const addPipe = (name: string, pipe: IPipe): void => {
  context.pipe.add(name, pipe)
}

export const removePipe = (name: string): void => {
  context.pipe.remove(name)
}

export function rollupPlugin (plugin: IPlugin) {
  plugin.rollup(context)
}

export function rollbackPlugin (plugin: IPlugin) {
  plugin.rollback(context)
}

export default factory
