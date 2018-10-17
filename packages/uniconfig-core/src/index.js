// @flow

/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import type {IConfig, IConfigOpts, IConfigInput, IPipe, IPlugin} from './interface'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

const context = createContext()

/**
 * Config factory.
 * @param {IConfigInput} input
 * @param {Object} opts
 * @returns {Config}
 */
const factory = (input: IConfigInput, opts: IConfigOpts): IConfig => {
  return new Config(input, opts)
}

const addPipe = (name: string, pipe: IPipe): void => {
  context.pipe.add(name, pipe)
}

const removePipe = (name: string): void => {
  context.pipe.remove(name)
}

const rollupPlugin = (plugin: IPlugin): void => {
  plugin.rollup(context)
}

const rollbackPlugin = (plugin: IPlugin): void => {
  plugin.rollback(context)
}

export * from './config'
export {
  context,
  pipeExecutor,
  factory,
  addPipe,
  removePipe,
  rollupPlugin,
  rollbackPlugin
}
export default factory
