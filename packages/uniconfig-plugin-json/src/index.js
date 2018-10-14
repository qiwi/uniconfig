// @flow

import type {IContext, IPlugin, IAny, IParser, IParse} from '../../uniconfig-core/src/interface'

export const type = 'json'

export const parse: IParse = (data: string): IAny => JSON.parse(data)

export const parser: IParser = {parse}

export default ({
  rollup(context: IContext): void {
    context.parser.add(type, parser)
  },
  rollback(context: IContext): void {
    context.parser.remove(type)
  },
}: IPlugin)
