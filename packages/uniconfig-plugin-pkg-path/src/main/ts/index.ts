import {
  IAny, IContext,
  INamedPipe,
} from '@qiwi/uniconfig-core'
import {findClosestPkg, findClosestPkgSync} from './find-pkg'

export const pipe: INamedPipe = {
  name: 'pkg-path',
  handleSync(_context: IContext, dirPath): IAny {
    return findClosestPkgSync(dirPath)
  },
  handle(_context: IContext, dirPath): Promise<IAny> {
    return findClosestPkg(dirPath)
  },
}

export default pipe
