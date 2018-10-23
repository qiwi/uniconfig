// @flow

import type {
  IContext,
  IPlugin,
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'
import dot from 'dot'

const type = 'dot'

export const pipe: IPipe = {
  handleSync({data, template}: Object = {}): IAny {
    return dot.template(template)(data)
  },
  handle({data, template}: Object = {}): IAny {
    return Promise.resolve(dot.template(template)(data))
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
