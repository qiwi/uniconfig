// @flow

import processor from './processor'
import api from './api'
import source from './source'
import AbstractComponent from './core/abstractComponent'
import type {IContext} from './interface'
import {ParserRegistry} from './parser/parserRegistry'

class Context extends AbstractComponent {
  api: any
  processor: any
  parser: any
  source: any

  constructor(): IContext {
    super()

    this.parser = new ParserRegistry()
    this.api = api
    this.processor = processor
    this.source = source

    return this
  }
}

export default function createContext(): IContext {
  return new Context()
}
