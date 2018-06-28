import {json, echo} from '../../src/parser'

describe('parser', () => {
  describe('json', () => {
    const value = {foo: 'bar', baz: 1}
    const str = JSON.stringify(value)

    expect(json(str)).toEqual(value)
    expect(json('null')).toBeNull()
  })

  describe('echo', () => {
    it('translates value as is', () => {
      const value = {}

      expect(echo(value)).toBe(value)
    })
  })
})
