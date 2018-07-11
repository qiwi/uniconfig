// @flow

import type {IPlugin} from '../interface'
import context from '../context'

export function rollupPlugin (plugin: IPlugin) {
  plugin.rollup(context)
}

export function rollbackPlugin (plugin: IPlugin) {
  plugin.rollback(context)
}
