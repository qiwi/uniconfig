// @flow

import type {
  IContext,
  IPlugin,
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'

const type = 'env'

export const pipe: IPipe = {
  handleSync(data: IAny): IAny {
    return process.env
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(process.env)
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
