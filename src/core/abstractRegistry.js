// @flow

import type {IAny, IRegistry, IRegistryIndex, IRegistryStore} from '../interface'
import AbstractComponent from './abstractComponent'

export default class AbstractRegistry extends AbstractComponent implements IRegistry {
  store: IRegistryStore
  index: IRegistryIndex
  type: string
  constructor (): IRegistry {
    super()
    this.type = 'abstract'
    this.store = []
    this.index = {}
    return this
  }
  register (name: string, ...args: IAny[]): void {
    this.constructor.notImplemented()
  }
  get (name: string, ...args: IAny[]): IAny {
    this.constructor.notImplemented()
  }
  has (name: string, ...args: IAny[]): boolean {
    return !!this.get(name, ...args)
  }
  flush (): void {
    this.store.length = 0
    this.index = {}
  }
}
