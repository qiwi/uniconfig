// @flow

import {get, has} from '../core/util'
import {json} from '../parser'
import {file as fileApi} from '../api'
import AbstractSource, {SYNC, PROCESSING} from './abstract'
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
    this.parser = json

    return this
  }
  connect (): ISource {
    const {mode, target, opts: {api}} = this
    this.setStatus(PROCESSING)

    const expression = mode === SYNC
      ? () => { this.data = this.parser(this.api.readSync(target, api)) }
      : this.api.read(target, api)
        .then(this.parser)
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
}
