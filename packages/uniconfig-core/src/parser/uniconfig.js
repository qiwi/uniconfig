// @flow

import yaml from './yaml'
import json from './json'
import detector, { JSON, YAML } from './detector'
import processor from '../processor'

import type { IAny, IParser } from '../interface'

export default (function (data: string): IAny {
  const type: string = detector(data)

  const parser: IParser | null = type === YAML
    ? yaml
    : type === JSON
      ? json
      : null

  if (parser === null) {
    throw new Error('uniconfig parser: unsupported input type ' + type)
  }

  return processor(parser(data))
}: IParser)
