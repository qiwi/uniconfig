// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type { IAny, IParser, IParserEntry } from '../interface'

export class ParserRegistry extends AbstractRegistry {
  store: IParserEntry[]
  constructor () {
    super()

    this.type = 'parser'
  }
}

export default new ParserRegistry()
