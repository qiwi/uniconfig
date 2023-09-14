import * as path from 'path'
import rootPlugin from '@qiwi/uniconfig-plugin-root'
import {
  IAny,
  IContext,
  INamedPipe,
  IPlugin,
} from '@qiwi/uniconfig-core'

export const ROOT_ALIASES = ['<root>', '$root', 'APP_ROOT']
export const CWD_ALIASES = ['<cwd>', '$cwd', 'CWD']

const getAliasValues = (context: IContext) => [
  {
    alias: ROOT_ALIASES,
    value: rootPlugin.handleSync(context),
  },
  {
    alias: CWD_ALIASES,
    value: process.cwd(),
  },
]

const injectValue = (aliases: string[], value: string, str: string) => {
  const re = new RegExp(
    `(${aliases.map(alias => alias.replace('$', '\\$')).join('|')})`,
  )
  return str.replace(re, value)
}

const injectAliasValues = (context: IContext, str: string) => {
  return getAliasValues(context)
    .reduce((acc, it) => {
      return injectValue(it.alias, it.value, acc)
    }, str)
}

export const name: string = 'path'

export const pipe: INamedPipe = {
  name,
  handleSync(_context: IContext, input): IAny {
    if (typeof input === 'string') {
      return path.resolve(injectAliasValues(_context, input))
    }

    if (Array.isArray(input)) {
      if (input.every(it => typeof it === 'string')) {
        return path.resolve(...input.map(it => injectAliasValues(_context, it)))
      }
      if (input.every(it => Array.isArray(it))) {
        return input.map(it => pipe.handleSync(_context, it))
      }
    }

    if (input && input.data) {
      return pipe.handleSync(_context, input.data)
    }

    throw new Error(`Invalid input ${input}, should be string | string[] | string[][] | { data: string | string[] }`)
  },
  handle(_context: IContext, data): Promise<IAny> {
    return Promise.resolve(pipe.handleSync(_context, data))
  },
}

export const plugin: IPlugin = {
  rollup(context: IContext): void {
    context.pipe.add(name, pipe)
    context.pipe.add(rootPlugin.name, rootPlugin)
  },
  rollback(context: IContext): void {
    context.pipe.remove(name)
    context.pipe.remove(rootPlugin.name)
  },
}

export default plugin
