import {json, echo, yaml, uniconfig, detector} from '../../src/parser'
import {JSON as Json, YAML} from '../../src/parser/detector'

describe('parser', () => {
  describe('json', () => {
    it('produces object from json string', () => {
      const value = {foo: 'bar', baz: 1}
      const str = JSON.stringify(value)

      expect(json(str)).toEqual(value)
      expect(json('null')).toBeNull()
    })
  })

  describe('yaml', () => {
    it('produces object from json string', () => {
      const value = {foo: 'bar', baz: 1}
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
    const value = {foo: 'bar', baz: 1}

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

  describe('detector', () => {
    it('detect yaml input', () => {
      const str = `
        foo: bar
        baz: 1
      `
      expect(detector(str)).toBe(YAML)
    })

    it('detect json input', () => {
      const value = {foo: 'bar'}
      const str = JSON.stringify(value)
      expect(detector(str)).toBe(Json)
    })

    it('detect other as typeof', () => {
      expect(detector(1)).toBe('number')
    })
  })
})
