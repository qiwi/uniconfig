// @flow

import type {IContext, IPlugin, IAny, IParser} from '../../uniconfig-core/src/interface'
import {safeLoad} from 'js-yaml'

const type = 'yaml'

export const load: IParser = (data: string): IAny => {
  return safeLoad(data)
}

const parser = {load}

export default ({
  rollup(context: IContext): void {
    context.parser.add(type, parser)
  },
  rollback(context: IContext): void {},
}: IPlugin)
