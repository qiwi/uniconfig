// @flow

import type { IContext, IPlugin } from '../interface'
import createContext from '../context'

export function rollupPlugin (plugin: IPlugin, context?: IContext) {
  plugin.rollup(context || createContext())
}

export function rollbackPlugin (plugin: IPlugin, context?: IContext) {
  plugin.rollback(context || createContext())
}
