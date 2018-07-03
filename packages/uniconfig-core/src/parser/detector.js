// @flow

import type {IAny} from '../interface'

export const JSON: string = 'json'
export const YAML: string = 'yaml'

export default function (raw: IAny): string {
  const type: string = typeof raw

  if (type === 'string') {
    if (raw[0] === '{' && raw[raw.length - 1] === '}') {
      return JSON
    }

    if (/^[\s\t\v]*\w+:/.test(raw)) {
      return YAML
    }
  }

  return type
}
