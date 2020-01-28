import {
  IAny,
  INamedPipe,
  IAnyObject,
  IContext,
} from '@qiwi/uniconfig-core'
import * as dot from 'dot'

export const name = 'dot'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, {data, template}: IAnyObject = {}): IAny {
    return dot.template(template)(data)
  },
  handle(_context: IContext, {data, template}: IAnyObject = {}): IAny {
    return Promise.resolve(dot.template(template)(data))
  },
}

export default pipe
