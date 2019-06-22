import {
  IAny,
  INamedPipe
} from '@qiwi/uniconfig-core'
import {parse} from 'dotenv'

export const name = 'dotenv'

export const pipe: INamedPipe = {
  name,
  handleSync(data: IAny): IAny {
    return parse(data)
  },
  handle(data: IAny): Promise<IAny> {
    return Promise.resolve(parse(data))
  }
}

export default pipe
