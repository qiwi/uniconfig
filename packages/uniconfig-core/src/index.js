// @flow

/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import type {
  IConfig,
  IConfigOpts,
  IConfigLegacyOpts,
  IConfigInput,
  IPipe,
  IPluginDeclaration,
  IContext
} from './interface'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

const context = createContext()

/**
 * Config factory.
 * @param {IConfigInput|IConfigOpts} input
 * @param {IConfigLegacyOpts} [legacyOpts]
 * @returns {Config}
 */
const factory = (input: IConfigInput | IConfigOpts, legacyOpts?: IConfigLegacyOpts): IConfig => {
  return new Config(input, legacyOpts)
}

const addPipe = (name: string, pipe: IPipe): void => {
  context.pipe.add(name, pipe)
}

const removePipe = (name: string): void => {
  context.pipe.remove(name)
}

const rollupPlugin = (plugin: IPluginDeclaration, _context?: IContext = context): void => {
  if (typeof plugin.rollup === 'function') {
    // NOTE flow 0.90.0 breaks prev checks
    // $FlowFixMe
    plugin.rollup(_context)
    return
  }

  if (typeof plugin.name === 'string') {
    _context.pipe.add(plugin.name, plugin)
  }
}

const rollbackPlugin = (plugin: IPluginDeclaration, _context?: IContext = context): void => {
  if (typeof plugin.rollback === 'function') {
    // $FlowFixMe
    plugin.rollback(_context)
    return
  }

  if (typeof plugin.name === 'string') {
    _context.pipe.remove(plugin.name)
  }
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
