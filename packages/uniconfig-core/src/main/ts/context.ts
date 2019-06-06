// @flow

import pipeRegistry from './pipe/pipeRegistry'
import AbstractComponent from './base/abstractComponent'
import type {IContext, IRegistry} from './interface'

export class Context extends AbstractComponent {
  pipe: IRegistry

  constructor(): IContext {
    super()
    this.pipe = pipeRegistry

    return this
  }
}

export default function createContext(): IContext {
  return new Context()
}
