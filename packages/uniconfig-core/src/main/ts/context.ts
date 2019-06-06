import pipeRegistry from './pipe/pipeRegistry'
import AbstractComponent from './base/abstractComponent'
import {IContext, IRegistry} from './interface'

export class Context extends AbstractComponent {
  pipe: IRegistry

  constructor() {
    super()
    this.pipe = pipeRegistry

    return this
  }
}

export default function createContext(): IContext {
  return new Context()
}
