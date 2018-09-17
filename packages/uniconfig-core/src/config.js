// @flow

import type {
  IConfig,
  IConfigOpts,
  IConfigInput,
  IAny,
  IEventEmitter,
  IEventListener,
  ISchemaRegistry
} from './interface'

import {get, has, each} from './core/util'
import {ConfigError, MISSED_VALUE_PATH} from './core/error'
import {eventEmitterFactory, READY} from './event'
import {SchemaRegistry} from './schema'
import Source, {SYNC} from './source/source'
import createContext from './context'

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

  constructor (input: IConfigInput, opts: IConfigOpts = {}): IConfig {
    this.input = input
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.type = 'config'
    this.id = '' + Math.random()
    this.emitter = this.opts.emitter || eventEmitterFactory()
    this.registry = new SchemaRegistry()
    this.context = createContext()

    const emitter = this.emitter
    const mode = this.opts.mode
    const sources = input.source || {}
    let sourcesAwaitingCount = Object.keys(sources).length

    each(sources, (sourceDefinition, sourceName) => {
      const source = new Source({emitter, mode, ...sourceDefinition})

      if (mode !== SYNC) {
        // TODO once()
        source.on('ready', () => {
          sourcesAwaitingCount -= 1
          if (sourcesAwaitingCount === 0) {
            this.evaluate()
            this.emit(READY)
          }
        })
      }
      this.context.source.add(sourceName, source)
      source.connect()

      if (mode === SYNC) {
        this.evaluate()
      }
    })

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

  // TODO supports recursion
  evaluate () {
    const data = this.data = {}
    each(this.input.data, (value, key)=> {
      if (/^\$.+:.+/.test(value)) {
        const [source, path] = value.slice(1).split(':')
        data[key] = this.context.source.get(source).get(path)
        return
      }

      data[key] = value
    })
  }
}
