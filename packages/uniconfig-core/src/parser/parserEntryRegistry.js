// @flow

import AbstractRegistry from '../core/abstractRegistry'
import type { IAny, IParser, IParserEntry } from '../interface'

export class ParserEntryRegistry extends AbstractRegistry {
  store: IParserEntry[]
  constructor () {
    super()

    this.type = 'parser'
  }

  get (type: string, raw: IAny): IParser | null {
    const entry: ?IParserEntry = this.store.find((entry: IParserEntry) => entry.condition(type, raw))

    return entry
      ? entry.parser
      : null
  }

  register (type: string, entry: IParserEntry) {
    this.store.push(entry)
  }
}

export default new ParserEntryRegistry()
