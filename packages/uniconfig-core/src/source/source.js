// @flow

import { get, has } from '../core/util'
import parserRegistry, { DEFAULT_PARSER } from '../parser/parserRegistry'
import apiRegistry from '../api/apiRegistry'

import type {
  IAny,
  IEventListener,
  ISource,
  ISourceOpts,
  IEventEmitter,
  IMode,
  IParser,
  ISourceStatus,
  IApi
} from '../interface'

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
export const MODE = { SYNC, ASYNC }

export default class Source implements ISource {
  type: string
  id: string
  status: ISourceStatus
  mode: IMode
  opts: ISourceOpts
  parser: IParser
  api: IApi
  emitter: IEventEmitter
  data: ?IAny
  target: string
  constructor (opts: ISourceOpts) {
    const { emitter, mode, target, api, parser } = opts

    this.id = '' + Math.random()
    this.status = INITIAL
    this.emitter = emitter
    this.opts = opts
    this.mode = mode
    this.target = target

    this.api = this.constructor.getApi(api)
    this.parser = this.constructor.getParser(parser)
    this.type = api + '-' + (parser || 'echo')

    return this
  }

  setStatus (status: ISourceStatus, data?: IAny): ISource {
    this.status = status
    this.emit(status, data)

    return this
  }

  emit (event: string, data?: IAny): boolean {
    const { type, id } = this

    return this.emitter.emit(`${type}_${event}_${id}`, {
      type: event,
      data
    })
  }

  on (event: string, listener: IEventListener) {
    const { type, id } = this
    this.emitter.on(`${type}_${event}_${id}`, listener)

    return this
  }

  connect (): ISource {
    const { mode, target, parser, api } = this
    this.setStatus(PROCESSING)

    const expression = mode === SYNC
      ? () => { this.data = parser.parse(api.readSync(target)) }
      : api.read(target)
        .then(parser.parse)
        .then((data: IAny): void => { this.data = data })

    this.constructor.finalize(this, expression)

    return this
  }

  get (path: string): IAny {
    this.constructor.assertReady(this)

    return get(this.data, path)
  }

  has (path: string): boolean {
    this.constructor.assertReady(this)

    return has(this.data, path)
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

  static getApi (name: string): IApi {
    const api = apiRegistry.get(name)

    if (!api) {
      throw new Error(`Source: target api "${name}" is not registered`)
    }

    return api
  }

  static getParser (name?: string): IParser {
    if (!name) {
      return DEFAULT_PARSER
    }

    const parser = parserRegistry.get(name)

    if (!parser) {
      throw new Error(`Source: target parser "${name}" is not registered`)
    }

    return parser
  }
}
