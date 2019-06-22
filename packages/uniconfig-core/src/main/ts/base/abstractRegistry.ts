import {
  IRegistry,
  IRegistryStore,
  IRegistryItem,
} from '../interface'

import AbstractComponent from './abstractComponent'

export default class AbstractRegistry extends AbstractComponent implements IRegistry {

  store: IRegistryStore
  type: string
  [key: string]: any
  constructor() {
    super()
    this.type = 'abstract'
    this.store = {}
  }
  add(name: string, item: IRegistryItem): void {
    this.store[name] = item
  }
  get(name: string): IRegistryItem | undefined {
    return this.store[name]
  }
  has(name: string): boolean {
    return !!this.get(name)
  }
  remove(name: string): void {
    delete this.store[name]
  }
  flush(): void {
    this.store = {}
  }
  find() {
    AbstractRegistry.notImplemented()
  }

}
