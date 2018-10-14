// @flow

import AbstractRegistry from '../base/abstractRegistry'
import type { IParserRegistryStore, IParser, IAny } from '../interface'

export const DEFAULT_PARSER: IParser = {
  parse: (data: IAny): IAny => data
}

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
