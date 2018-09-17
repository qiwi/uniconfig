// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type {IRegistryStore} from '../interface'

export default class SourceRegistry extends AbstractRegistry {
  store: IRegistryStore
  type: string
  constructor () {
    super()

    this.type = 'source'
    return this
  }
}
