// @flow

import AbstractRegistry from '../core/abstractRegistry'

export class ParserRegistry extends AbstractRegistry {
  constructor () {
    super()

    this.type = 'parser'
  }
}

export default new ParserRegistry()
