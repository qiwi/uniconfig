// @flow

import {get, has, echo} from '../base'
import {file as fileApi} from '../api'
import AbstractSource, {SYNC, PROCESSING, FAILURE, READY} from './abstractSource'
import type {
  ISource,
  ISourceStatus,
  IAny,
  ISourceOpts,
  IParser,
  IMode
} from '../interface'

import type {IFileApi} from '../api/file'

export default class FileSource extends AbstractSource implements ISource {
  type: string
  status: ISourceStatus
  mode: IMode
  opts: ISourceOpts
  parser: IParser
  api: IFileApi
  data: ?IAny
  target: string
  constructor (opts: ISourceOpts) {
    super(opts)
    this.type = 'file'
    this.api = fileApi
    this.parser = echo

    return this
  }
  connect (): ISource {
    const {mode, target, opts: {api}} = this
    this.setStatus(PROCESSING)

    if (mode === SYNC) {
      try {
        this.data = this.parser(this.api.readSync(target, api))
        this.setStatus(READY)
      } catch (err) {
        this.setStatus(FAILURE, err)
      }
    } else {
      this.api.read(target, api)
        .then(this.parser)
        .then((data: IAny): void => { this.data = data })
        .then((): boolean => this.emit(READY))
        .catch((err: IAny): boolean => this.emit(FAILURE, err))
    }

    return this
  }

  get (path: string): IAny {
    this.constructor.assertReady(this.status)

    return get(this.data, path)
  }

  has (path: string): boolean {
    this.constructor.assertReady(this.status)

    return has(this.data, path)
  }
}
