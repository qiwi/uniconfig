// @flow

import type {
  IAny,
  IPipe
} from '../../uniconfig-core/src/interface'
import read, {sync as readSync} from 'read-pkg'

export default ({
  name: 'pkg',
  handleSync(data: IAny): IAny {
    return readSync()
  },
  handle(data: IAny): Promise<IAny> {
    return read()
  }
}: IPipe)
