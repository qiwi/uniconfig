// @flow

import type {
  IConfig,
  IConfigOpts,
  IConfigInput,
  IAny,
  IEventEmitter,
  IEventListener,
  IContext,
  IConfigPromise,
  IIntention,
  IResolve,
  IReject
} from './interface'

import {get, has} from './base/util'
import {ConfigError, MISSED_VALUE_PATH} from './base/error'
import {eventEmitterFactory, READY} from './event'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

export const SYNC = 'sync'
export const ASYNC = 'async'
export const DEFAULT_OPTS: IConfigOpts = {
  tolerateMissed: true
}

export class Config {
  data: IAny
  opts: IConfigOpts
  id: string
  type: string
  emitter: IEventEmitter
  context: IContext
  input: IConfigInput
  ready: IConfigPromise
  intention: IIntention

  constructor (input: IConfigInput, opts: IConfigOpts = {}): IConfig {
    this.input = input
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.type = 'config'
    this.id = '' + Math.random()
    this.emitter = this.opts.emitter || eventEmitterFactory()
    this.context = createContext()
    this.intention = this.constructor.getIntention()
    this.ready = this.intention.promise

    const pipeline = this.opts.pipeline || ''
    const mode = this.opts.mode || SYNC
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
    this.intention.resolve(this)
    this.emit(READY)

    return this
  }

  static getIntention(): IIntention {
    let resolve
    let reject

    const promise: IConfigPromise = new Promise((...args: [IResolve, IReject]) => [resolve, reject] = args)

    return {
      promise,
      resolve(data) { resolve(data) },
      reject(data) { reject(data) }
    }
  }
}

export default Config
