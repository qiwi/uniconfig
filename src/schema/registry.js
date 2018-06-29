// @flow

import {satisfies} from 'semver'
import type {IAny, ISchemaStore, ISchemaRegistry} from '../interface'

export default class SchemaRegistry implements ISchemaRegistry {
  store: ISchemaStore
  constructor (): ISchemaRegistry {
    this.store = []
    return this
  }
  register (type: string, range: string, schema: IAny): ISchemaRegistry {
    this.store.push({
      type,
      range,
      schema
    })
    return this
  }
  get (type: string, version: string): IAny {
    const found = this.store.find(({range, type: _type}) => {
      return _type === type && satisfies(version, range)
    })
    return found
      ? found.schema
      : null
  }
  has (type: string, version: string): boolean {
    return !!this.get(type, version)
  }
  flush (): ISchemaRegistry {
    this.store.length = 0
    return this
  }
}
