// @flow

import type {
  IConfig,
  IConfigOpts,
  IAny,
  IEventEmitter,
  IEventListener,
  ISchemaRegistry
} from './interface'

import {get, has} from './core/util'
import {ConfigError, MISSED_VALUE_PATH} from './core/error'
import {eventEmitterFactory, READY} from './event'
import {SchemaRegistry} from './schema'

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

  constructor (source: string, opts: IConfigOpts = {}): IConfig {
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.data = this.constructor.parse(this.constructor.load(source))
    this.type = 'config'
    this.id = '' + Math.random()
    this.emitter = this.opts.emitter || eventEmitterFactory()
    this.registry = new SchemaRegistry()

    this.emit(READY)

    return this
  }

  get (path: string): IAny {
    if (!this.opts.tolerateMissed && !this.has(path)) {
      throw new ConfigError(MISSED_VALUE_PATH)
    }

    return get(this.data, path)
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

  static load (source: string): IAny {}

  static parse (data: IAny): IAny {}
}
