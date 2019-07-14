import {
  IAny,
  INamedPipe,
  IAnyObject,
} from '@qiwi/uniconfig-core'
import * as dot from 'dot'

export const name = 'dot'

export const pipe: INamedPipe = {
  name,
  handleSync({data, template}: IAnyObject = {}): IAny {
    return dot.template(template)(data)
  },
  handle({data, template}: IAnyObject = {}): IAny {
    return Promise.resolve(dot.template(template)(data))
  },
}

export default pipe