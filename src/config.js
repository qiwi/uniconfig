// @flow

import type {IConfig, IConfigOpts, IAny} from './interface'
import {get} from './base'

export const DEFAULT_OPTS: IConfigOpts = {
  tolerateMissed: true
}

export default class Config {
  data: IAny
  opts: IConfigOpts

  constructor (source: string, opts: IConfigOpts = {}): IConfig {
    this.opts = {...DEFAULT_OPTS, ...opts}
    this.data = this.constructor.load(source)

    return this
  }

  get (path: string): IAny {
    return get(this.data, path)
  }

  static load (source: string) {

  }
}
