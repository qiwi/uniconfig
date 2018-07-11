// @flow

import type {IContext, IPlugin} from '../interface'

export function rollupPlugin (plugin: IPlugin, context: IContext) {
  plugin.rollup(context)
}

export function rollbackPlugin (plugin: IPlugin, context: IContext) {
  plugin.rollback(context)
}
