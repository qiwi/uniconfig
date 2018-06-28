import {json, echo, yaml} from '../../src/parser'

describe('parser', () => {
  describe('json', () => {
    const value = {foo: 'bar', baz: 1}
    const str = JSON.stringify(value)

    expect(json(str)).toEqual(value)
    expect(json('null')).toBeNull()
  })

  describe('yaml', () => {
    const value = {foo: 'bar', baz: 1}
    const str = `
      foo: bar
      baz: 1
    `
    expect(yaml(str)).toEqual(value)
    expect(yaml('null')).toBeNull()
    expect(yaml('')).toBeUndefined()
  })

  describe('echo', () => {
    it('translates value as is', () => {
      const value = {}

      expect(echo(value)).toBe(value)
    })
  })
})
