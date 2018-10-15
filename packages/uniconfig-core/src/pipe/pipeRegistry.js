// @flow

import AbstractRegistry from '../base/abstractRegistry'
import type { IPipe } from '../interface'

export type IPipeRegistryStore = {
  [key: string]: IPipe
}

export class PipeRegistry extends AbstractRegistry {
  store: IPipeRegistryStore
  type: string
  constructor () {
    super()
    this.store = {}
    this.type = 'pipe'
    return this
  }
}

export default new PipeRegistry()
