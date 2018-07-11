// @flow

import type {IContext, IPlugin, IAny, IParser} from '../../uniconfig-core/src/interface'

import {safeLoad} from 'js-yaml'

const type = 'yaml'

export const load: IParser = (data: string): IAny => {
  return safeLoad(data)
}

export default ({
  rollup(context: IContext): void {
    context.parser.register(type, {})
  },
  rollback(context: IContext): void {},
}: IPlugin)
