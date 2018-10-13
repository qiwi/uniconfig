// @flow

/**
 * Uniconfig core
 * @module uniconfig-core
 */

import Config from './config'
import type {IConfig, IConfigOpts, IConfigInput} from './interface'

/**
 * Config factory.
 * @param {IConfigInput} input
 * @param {Object} opts
 * @returns {Config}
 */
export function factory(input: IConfigInput, opts: IConfigOpts): IConfig {
  return new Config(input, opts)
}

export {Config}

export {rollupPlugin, rollbackPlugin} from './plugin'

export default factory
