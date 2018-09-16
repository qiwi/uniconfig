// @flow

import AbstractRegistry from '../core/abstractRegistry'

export default class SourceRegistry extends AbstractRegistry {
  constructor () {
    super()

    this.type = 'source'
  }
}
