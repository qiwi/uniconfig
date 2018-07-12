// @flow

import type {IAny, IParser} from '../interface'

import {echo} from '../core/util'
import json from './json'
import yaml from './yaml'
import uniconfig from './uniconfig'
import detector, {JSON, YAML} from './detector'
import registry from './parserEntryRegistry'

export {
  echo,
  json,
  yaml,
  uniconfig,
  detector,
  registry
}

export default function (data: IAny): void {
  const type: string = detector(data)
  const parser: IParser | null = type === YAML
    ? yaml
    : type === JSON
      ? json
      : null

  if (parser === null) {
    throw new Error('uniconfig parser: unsupported input type ' + type)
  }

  return parser(data)
}
