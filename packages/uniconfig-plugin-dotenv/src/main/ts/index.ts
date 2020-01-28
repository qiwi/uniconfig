import {
  IAny, IContext,
  INamedPipe,
} from '@qiwi/uniconfig-core'
import {parse} from 'dotenv'

export const name = 'dotenv'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, data: IAny): IAny {
    return parse(data)
  },
  handle(_context: IContext, data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  },
}

export default pipe
