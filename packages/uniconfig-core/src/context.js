// @flow

import processor from './processor'
import pipeRegistry from './pipe/pipeRegistry'
import apiRegistry from './api/apiRegistry'
import parserRegistry from './parser/parserRegistry'
import SourceRegistry from './source/sourceRegistry'
import AbstractComponent from './base/abstractComponent'
import type {IContext, IRegistry} from './interface'

export class Context extends AbstractComponent {
  api: IRegistry
  processor: any
  parser: IRegistry
  source: IRegistry
  pipe: IRegistry

  constructor(): IContext {
    super()

    this.parser = parserRegistry
    this.api = apiRegistry
    this.pipe = pipeRegistry
    this.source = new SourceRegistry()
    this.processor = processor

    return this
  }
}

export default function createContext(): IContext {
  return new Context()
}
