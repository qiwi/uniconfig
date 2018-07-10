// @flow
/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import type {IConfig, IConfigOpts} from './interface'

/**
 * Config factory.
 * @param {string} source
 * @param {Object} opts
 * @returns {Config}
 */
export function factory(source: string, opts: IConfigOpts): IConfig {
  return new Config(source, opts)
}

export default factory
