// @flow

import type {
  IAny,
  IEventListener,
  ISource,
  ISourceOpts,
  IEventEmitter,
  IMode,
  IParser,
  ISourceStatus
} from '../interface'
import {echo} from '../base'

export const INITIAL = 'initial'
export const PROCESSING = 'processing'
export const READY = 'ready'
export const FAILURE = 'failure'
export const STATUS = {
  INITIAL,
  PROCESSING,
  READY,
  FAILURE
}

export const SYNC = 'sync'
export const ASYNC = 'async'
export const MODE = {SYNC, ASYNC}

export default class AbstractSource implements ISource {
  type: string
  id: string
  status: ISourceStatus
  mode: IMode
  opts: ISourceOpts
  parser: IParser
  api: IAny
  emitter: IEventEmitter
  data: ?IAny
  target: string
  constructor (opts: ISourceOpts) {
    if (this.constructor === AbstractSource) {
      throw new Error('Abstract source: cannot be instantiated')
    }

    const {emitter, mode, target} = opts

    this.type = 'abstract'
    this.id = '' + Math.random()
    this.status = INITIAL
    this.emitter = emitter
    this.opts = opts
    this.mode = mode
    this.target = target
    this.api = {}
    this.parser = echo

    return this
  }

  setStatus (status: ISourceStatus, data?: IAny): ISource {
    this.status = status
    this.emit(status, data)

    return this
  }

  emit (event: string, data?: IAny): boolean {
    const {type, id} = this

    return this.emitter.emit(`${type}_${event}_${id}`, {
      type: event,
      data
    })
  }

  on (event: string, listener: IEventListener) {
    const {type, id} = this
    this.emitter.on(`${type}_${event}_${id}`, listener)

    return this
  }

  connect (): ISource {
    notImplemented()
    return this
  }

  get (path: string): void {
    notImplemented()
  }

  has (path: string): boolean {
    return !!notImplemented()
  }

  static assertReady (source: ISource): void {
    if (source.status !== READY) {
      throw new Error('Invalid source status: ' + source.status)
    }
  }

  static finalize (source: ISource, expression: Function | Promise<IAny>): IAny {
    let res
    if (typeof expression === 'function') {
      try {
        res = expression()
        source.setStatus(READY)
      } catch (err) {
        source.setStatus(FAILURE, err)
      }
    } else {
      res = expression
        .then((): ISource => source.setStatus(READY))
        .catch((err: IAny): ISource => source.setStatus(FAILURE, err))
    }

    return res
  }
}

export function notImplemented (): void {
  throw new Error('Abstract source: not implemented')
}
