// @flow

import type {IConfig, IConfigOpts, IAny} from './interface'
import {get, has} from './base'
import {ConfigError, MISSED_VALUE_PATH} from './error'

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
    if (!this.opts.tolerateMissed && !this.has(path)) {
      throw new ConfigError(MISSED_VALUE_PATH)
    }

    return get(this.data, path)
  }

  has (path: string): boolean {
    return has(this.data, path)
  }

  static load (source: string) {

  }
}
