// @flow

import type {
  IPipe,
  IAny,
  IAnyObject
} from '../../uniconfig-core/src/interface'

import Ajv from 'ajv'

export const name = 'ajv'
export const DEFAULT_OPTS = {}

const ajvStack = {}
const getAjv = (opts: IAnyObject): IAnyObject => {
  const key = JSON.stringify(opts)

  if (!ajvStack[key]) {
    ajvStack[key] = new Ajv(opts)
  }

  return ajvStack[key]
}

export type IAjvInput = {
  data: IAny,
  schema?: ?IAnyObject,
  opts?: ?IAnyObject
}

export const handle = ({data, schema, opts}: IAjvInput): IAny => {
  const ajv = getAjv(opts || DEFAULT_OPTS)

  if (!schema) {
    throw new Error('[uniconfig ajv]: schema MUST be specified')
  }

  if (!ajv.validate(schema, data)) {
    throw new Error(`[uniconfig ajv]: ${ajv.errorsText()}`)
  }

  return data
}

export default ({
  name,
  handleSync(input: IAjvInput): IAny {
    return handle(input)
  },
  handle(input: IAjvInput): Promise<IAny> {
    return new Promise((resolve, reject) => {
      try {
        resolve(handle(input))

      } catch (e) {
        reject(e)
      }
    })
  }
}: IPipe)
