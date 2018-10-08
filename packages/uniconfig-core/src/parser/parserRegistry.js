// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type { IParserRegistryStore } from '../interface'

export class ParserRegistry extends AbstractRegistry {
  store: IParserRegistryStore
  type: string
  constructor () {
    super()
    this.store = {}
    this.type = 'parser'
    return this
  }
}

export default new ParserRegistry()
