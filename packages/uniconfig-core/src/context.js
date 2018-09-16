// @flow

import processor from './processor'
import apiRegistry from './api/apiRegistry'
import parserRegistry from './parser/parserRegistry'
import SourceRegistry from './source/SourceRegistry'
import AbstractComponent from './core/abstractComponent'
import type {IContext} from './interface'

export class Context extends AbstractComponent {
  api: any
  processor: any
  parser: any
  source: any

  constructor(): IContext {
    super()

    this.parser = parserRegistry
    this.api = apiRegistry
    this.source = new SourceRegistry()
    this.processor = processor

    return this
  }
}

export default function createContext(): IContext {
  return new Context()
}
