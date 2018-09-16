// @flow

import type {IRegistry} from '../interface'
import AbstractRegistry from '../core/abstractRegistry'

export class ApiRegistry extends AbstractRegistry implements IRegistry {
  constructor () {
    super()

    this.type = 'api'
  }
}

export default new ApiRegistry()
