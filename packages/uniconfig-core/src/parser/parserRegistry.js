// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type {IParserRegistryStore} from '../interface'

export class ParserRegistry extends AbstractRegistry {
  store: IParserRegistryStore
  constructor () {
    super()

    this.type = 'parser'
  }
}

export default new ParserRegistry()
