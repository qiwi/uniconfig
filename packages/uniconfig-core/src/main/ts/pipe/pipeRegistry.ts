import AbstractRegistry from '../base/abstractRegistry'
import {IPipe, IRegistry} from '../interface'

export type IPipeRegistryStore = {
  [key: string]: IPipe
}

export class PipeRegistry extends AbstractRegistry implements IRegistry {

  store: IPipeRegistryStore
  type: string
  [key: string]: any
  constructor() {
    super()
    this.store = {}
    this.type = 'pipe'
  }

}

export default new PipeRegistry()
