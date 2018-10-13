// @flow

import type {IContext, IPlugin, IAny, IParser, IParse} from '../../uniconfig-core/src/interface'

const type = 'json'

export const parse: IParse = (data: string): IAny => JSON.parse(data)

const parser: IParser = {parse}

export default ({
  rollup(context: IContext): void {
    context.parser.add(type, parser)
  },
  rollback(context: IContext): void {
    context.parser.remove(type)
  },
}: IPlugin)
