import {
  IConfig,
  IConfigOpts,
  IConfigLegacyOpts,
  IConfigInput,
  IAny,
  IEventEmitter,
  IEventListener,
  IContext,
  IConfigPromise,
  IIntention,
  IResolve,
  IReject,
  IInjectsMap,
} from './interface'

import {get, has, reduce} from './base/util'
import {ConfigError, MISSED_VALUE_PATH, BROKEN_INJECT} from './base/error'
import {eventEmitterFactory, READY} from './event'
import createContext from './context'
import pipeExecutor from './pipe/pipeExecutor'

export const SYNC = 'sync'
export const ASYNC = 'async'
export const DEFAULT_OPTS: IConfigOpts = {
  mode: SYNC,
  tolerateMissed: true,
}

export class Config {
  data: IAny
  opts: IConfigOpts
  id: string
  type: string
  emitter: IEventEmitter
  context: IContext
  ready: IConfigPromise
  intention: IIntention

  constructor (input: IConfigInput | IConfigOpts, legacyOpts?: IConfigLegacyOpts) {
    this.opts = Config.processOpts(input, legacyOpts)
    this.type = 'config'
    this.id = '' + Math.random()
    this.emitter = this.opts.emitter || eventEmitterFactory()
    this.context = createContext()
    this.intention = Config.getIntention()
    this.ready = this.intention.promise

    const pipeline = this.opts.pipeline || ''
    const mode = this.opts.mode || SYNC
    const injected = Config.processInjects(this.opts.data, this.opts.injects)
    const data = pipeExecutor(injected, pipeline, mode, this.context.pipe)

    if (mode === SYNC) {
      this.setData(data)
    } else {
      data.then(this.setData.bind(this))
    }
  }

  get (path?: string): IAny {
    if (path && !this.opts.tolerateMissed && !this.has(path)) {
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
    let resolve: Function
    let reject: Function

    const promise: IConfigPromise = new Promise((...args: [IResolve, IReject]) => [resolve, reject] = args)

    return {
      promise,
      resolve(data: any) { return resolve(data) },
      reject(data: any) { return reject(data) },
    }
  }

  static processOpts(input: IConfigInput | IConfigOpts, legacyOpts?: IConfigLegacyOpts): IConfigOpts {
    if (legacyOpts) {
      console.warn('Lecacy opts support will be dropped in the next major release')
      return {...DEFAULT_OPTS, ...legacyOpts, data: input}
    }

    if (input.pipeline || input.mode) {
      return {...DEFAULT_OPTS, ...input}
    }

    return {
      ...DEFAULT_OPTS,
      data: input,
    }
  }

  static processInjects(input: IConfigInput, injects?: IInjectsMap): IConfigInput {
    if (!injects) {
      return input
    }

    try {
      return JSON.parse(reduce(injects, (memo, inject, name) => {
        let {from, to} = typeof inject === 'object' && inject.hasOwnProperty('from') && inject.hasOwnProperty('to')
          ? inject
          : {from: name, to: inject}

        if (typeof to === 'object') {
          to = JSON.stringify(to)

          if (typeof from === 'string') {
            from = '"' + from + '"'
          }
        }

        return memo.replace(from, to)
      }, JSON.stringify(input)))
    } catch (err) {

      throw new ConfigError(BROKEN_INJECT)
    }
  }
}

export default Config
