// @flow

import type {
  IRegistry,
  IRegistryStore,
  IRegistryItem,
} from '../interface'
import AbstractComponent from './abstractComponent'

export default class AbstractRegistry extends AbstractComponent implements IRegistry {
  store: IRegistryStore
  type: string
  constructor (): IRegistry {
    super()
    this.type = 'abstract'
    this.flush()
    return this
  }
  add (name: string, item: IRegistryItem): void {
    this.store[name] = item
  }
  get (name: string): ?IRegistryItem {
    return this.store[name]
  }
  has (name: string): boolean {
    return !!this.get(name)
  }
  remove (name: string): void {
    delete this.store[name]
  }
  flush (): void {
    this.store = {}
  }
  find () {
    this.constructor.notImplemented()
  }
}
