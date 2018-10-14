// @flow

import AbstractRegistry from '../base/abstractRegistry'
import type { IRegistryStore } from '../interface'

export default class SourceRegistry extends AbstractRegistry {
  store: IRegistryStore
  type: string
  constructor () {
    super()

    this.store = {}
    this.type = 'source'
    return this
  }
}
