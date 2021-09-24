/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import {
  IConfig,
  IConfigInput,
  IConfigLegacyOpts,
  IConfigOpts,
  IContext,
  IEnvType,
  INamedPipe,
  IPipe,
  IPlugin,
  IPluginDeclaration,
} from './interface'
import {defaultContext, createContext} from './context'
import pipeExecutor from './pipe/pipeExecutor'
import {isBrowser, isNode} from './base/util';

const context = defaultContext

/**
 * Config factory.
 * @param {IConfigInput|IConfigOpts} input
 * @param {IConfigLegacyOpts} [legacyOpts]
 * @returns {Config}
 */
const factory = (input: IConfigInput | IConfigOpts, legacyOpts?: IConfigLegacyOpts): IConfig => {
  return new Config(input, legacyOpts)
}

export const assertEnvType = (env?: IEnvType, name: string = '') => {
  if (!env) {
    return
  }

  if (env === IEnvType.BROWSER && isBrowser) {
    return
  }

  if (env === IEnvType.NODE && isNode) {
    return
  }

  throw new Error(`Uniconfig plugin '${name}' requires '${env}' env only`)
}

const addPipe = (name: string, pipe: IPipe, env?: IEnvType, _context: IContext = context): void => {
  assertEnvType(env, name)
  _context.pipe.add(name, pipe)
}

const removePipe = (name: string, _context: IContext = context): void => {
  _context.pipe.remove(name)
}

const getPipes = (): string[] => Object.keys(context.pipe.store)

const rollupPlugin = (plugin: IPlugin | INamedPipe, _context: IContext = context): void => {
  if (typeof plugin.rollup === 'function') {
    plugin.rollup(_context)
    return
  }

  if (typeof plugin.name === 'string') {
    addPipe(plugin.name, plugin as INamedPipe, plugin.env, _context)
  }
}

const rollbackPlugin = (plugin: IPluginDeclaration, _context: IContext = context): void => {
  if (typeof plugin.rollback === 'function') {
    plugin.rollback(_context)
    return
  }

  if (typeof plugin.name === 'string') {
    _context.pipe.remove(plugin.name)
  }
}

export * from './config'
export * from './constants'
export {
  context,
  pipeExecutor,
  factory,
  addPipe,
  removePipe,
  getPipes,
  rollupPlugin,
  rollbackPlugin,
  createContext,
  defaultContext,
}
export default factory

export * from './interface'
