// @flow

import type { IRegistry, IRegistryStore } from '../interface'
import AbstractRegistry from '../core/abstractRegistry'

export class ApiRegistry extends AbstractRegistry implements IRegistry {
  store: IRegistryStore
  type: string
  constructor () {
    super()
    this.store = {}
    this.type = 'api'
    return this
  }
}

export default new ApiRegistry()
