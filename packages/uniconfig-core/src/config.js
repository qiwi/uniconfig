// @flow

import type {
  IConfig,
  IConfigOpts,
  IConfigInput,
  IAny,
  IEventEmitter,
  IEventListener,
  ISchemaRegistry,
  IContext
} from './interface'

import {get, has, each} from './base/util'
import {ConfigError, MISSED_VALUE_PATH} from './base/error'
import {eventEmitterFactory, READY} from './event'
import {SchemaRegistry} from './schema'
import {SYNC} from './source/source'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

export const DEFAULT_OPTS: IConfigOpts = {
  tolerateMissed: true
}

export default class Config {
  data: IAny
  opts: IConfigOpts
  id: string
  type: string
  emitter: IEventEmitter
  registry: ISchemaRegistry
  context: IContext
  input: IConfigInput

  constructor (input: IConfigInput, opts: IConfigOpts = {}): IConfig {
    this.input = input
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.type = 'config'
    this.id = '' + Math.random()
    this.emitter = this.opts.emitter || eventEmitterFactory()
    this.registry = new SchemaRegistry()
    this.context = createContext()

    const pipeline = this.opts.pipeline
    const mode = this.opts.mode || 'sync'
    const data = pipeExecutor(this.input, pipeline, mode, this.context.pipe)

    if (mode === SYNC) {
      this.setData(data)
    } else {
      data.then(this.setData.bind(this))
    }

    return this
  }

  get (path: string): IAny {
    if (!this.opts.tolerateMissed && !this.has(path)) {
      throw new ConfigError(MISSED_VALUE_PATH)
    }

    return path
      ? get(this.data, path)
      : this.data
  }

  has (path: string): boolean {
    return has(this.data, path)
  }

  on (event: string, listener: IEventListener): IConfig {
    this.emitter.on(event + this.id, listener)
    return this
  }

  off (event: string, listener: IEventListener): IConfig {
    this.emitter.removeListener(event + this.id, listener)
    return this
  }

  emit (event: string, data?: IAny): boolean {
    return this.emitter.emit(event + this.id, {type: event, data})
  }

  setData (data: IAny) {
    this.data = data
    this.emit(READY)

    return this
  }
}
