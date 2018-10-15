// @flow

import type {
  IContext,
  IPlugin,
  IAny,
  IParse,
  IPipe
} from '../../uniconfig-core/src/interface'
import {safeLoad} from 'js-yaml'

const type = 'yaml'

export const parse: IParse = (data: string): IAny => safeLoad(data)

export const pipe: IPipe = {
  handleSync(data: IAny): IAny {
    return parse(data)
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  }
}

export default ({
  rollup(context: IContext): void {
    context.pipe.add(type, pipe)
  },
  rollback(context: IContext): void {
    context.pipe.remove(type)
  },
}: IPlugin)
