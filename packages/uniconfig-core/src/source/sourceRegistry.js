// @flow

import AbstractRegistry from '../core/abstractRegistry'

export class SourceRegistry extends AbstractRegistry {
  constructor () {
    super()

    this.type = 'source'
  }
}

export default new SourceRegistry()
