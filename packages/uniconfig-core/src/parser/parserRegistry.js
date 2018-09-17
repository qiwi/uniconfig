// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type {IParserRegistryStore, IRegistryStore} from '../interface'

export class ParserRegistry extends AbstractRegistry {
  store: IParserRegistryStore
  type: string
  constructor () {
    super()

    this.type = 'parser'
    return this
  }
}

export default new ParserRegistry()
