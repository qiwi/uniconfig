import {safeLoad} from 'js-yaml'
import {
  IAny,
  INamedPipe,
} from '@qiwi/uniconfig-core'

export const name = 'yaml'

export const parse = (data: string): IAny => safeLoad(data)

export const pipe: INamedPipe = {
  name,
  handleSync(data: IAny): IAny {
    return parse(data)
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  },
}

export default pipe
