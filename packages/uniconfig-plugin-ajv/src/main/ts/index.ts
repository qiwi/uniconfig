import {
  INamedPipe,
  IAny,
  IAnyObject,
  IContext,
} from '@qiwi/uniconfig-core'

import Ajv from 'ajv'
import addAjvFormats from 'ajv-formats'

export const name = 'ajv'
export const DEFAULT_OPTS = {}

const ajvStack: IAnyObject = {}
const getAjv = (opts: IAnyObject): IAnyObject => {
  const key = JSON.stringify(opts)

  if (!ajvStack[key]) {
    ajvStack[key] = new Ajv(opts)
    addAjvFormats(ajvStack[key])
  }

  return ajvStack[key]
}

export type IAjvInput = {
  data: IAny,
  schema?: IAnyObject,
  opts?: IAnyObject
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

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, input: IAjvInput): IAny {
    return handle(input)
  },
  handle(_context: IContext, input: IAjvInput): Promise<IAny> {
    return new Promise((resolve, reject) => {
      try {
        resolve(handle(input))
      }
      catch (e) {
        reject(e)
      }
    })
  },
}

export default pipe
