import { PipeRegistry } from './pipe/pipeRegistry'
import AbstractComponent from './base/abstractComponent'
import {IContext, IRegistry} from './interface'

export class Context extends AbstractComponent {
  pipe: IRegistry

  constructor() {
    super()
    this.pipe = new PipeRegistry()

    return this
  }
}

export const createContext = (): IContext => new Context()

export const defaultContext = createContext()
