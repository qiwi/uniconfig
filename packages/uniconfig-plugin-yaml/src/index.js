// @flow

import type {IContext, IPlugin, IAny, IParser, IParse} from '../../uniconfig-core/src/interface'
import {safeLoad} from 'js-yaml'

const type = 'yaml'

export const parse: IParse = (data: string): IAny => {
  return safeLoad(data)
}

const parser: IParser = {parse}

export default ({
  rollup(context: IContext): void {
    context.parser.add(type, parser)
  },
  rollback(context: IContext): void {
    context.parser.remove(type)
  },
}: IPlugin)
