// @flow

import { echo } from '../core/util'
import json from './json'
import detector from './detector'
import registry from './parserRegistry'

export {
  echo,
  json,
  detector,
  registry
}

/*
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
*/
