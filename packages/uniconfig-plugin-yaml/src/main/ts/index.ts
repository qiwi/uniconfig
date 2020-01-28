import {safeLoad} from 'js-yaml'
import {
  IAny, IContext,
  INamedPipe,
} from '@qiwi/uniconfig-core'

export const name = 'yaml'

export const parse = (data: string): IAny => safeLoad(data)

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
