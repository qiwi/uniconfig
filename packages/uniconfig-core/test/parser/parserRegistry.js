import parserRegistry from '../../src/parser/parserRegistry'
import AbstractRegistry from '../../src/core/abstractRegistry'

describe('parser/parserRegistry', () => {
  describe('has proper inners', () => {
    expect(parserRegistry.type).toBe('parser')
  })

  describe('proto', () => {
    ['add', 'get', 'remove', 'flush', 'has', 'find'].map(method => {
      it('`' + method + '` inherited from AbstractRegistry', () => {
        expect(parserRegistry[method]).toBe(AbstractRegistry.prototype[method])
      })
    })
  })
})

import { json, echo, yaml, uniconfig } from '../../src/parser'

/*
describe('parser', () => {
  describe('json', () => {
    it('produces object from json string', () => {
      const value = { foo: 'bar', baz: 1 }
      const str = JSON.stringify(value)

      expect(json(str)).toEqual(value)
      expect(json('null')).toBeNull()
    })
  })

  describe('yaml', () => {
    it('produces object from json string', () => {
      const value = { foo: 'bar', baz: 1 }
      const str = `
      foo: bar
      baz: 1
    `
      expect(yaml(str)).toEqual(value)
      expect(yaml('null')).toBeNull()
      expect(yaml('')).toBeUndefined()
    })
  })

  describe('echo', () => {
    it('translates value as is', () => {
      const value = {}

      expect(echo(value)).toBe(value)
    })
  })

  describe('uniconfig', () => {
    const value = { foo: 'bar', baz: 1 }

    it('parses yaml-formatted meta', () => {
      const str = `
        foo: bar
        baz: 1
      `
      expect(uniconfig(str)).toEqual(value)
    })

    it('parses json-formatted meta', () => {
      const str = JSON.stringify(value)

      expect(uniconfig(str)).toEqual(value)
    })

    it('handles unsupported input', () => {
      expect(() => uniconfig(undefined)).toThrow('uniconfig parser: unsupported input type undefined')
      expect(() => uniconfig('foo')).toThrow('uniconfig parser: unsupported input type string')
    })
  })
})
*/
