import {SchemaRegistry} from '../../src/schema'

describe('schema/registry', () => {
  const reg = new SchemaRegistry()
  const type = 'foo'
  const range = '1.x - 2.2.0'
  const schema = {}

  it('constructor returns proper instance', () => {
    expect(reg.store).toEqual(expect.any(Array))
  })

  describe('proto', () => {
    it('`register` adds new entry to store', () => {
      expect(reg.register(type, range, schema)).toBe(reg)
      expect(reg.store[0]).toEqual({
        type,
        range,
        schema
      })
    })

    describe('getters', () => {
      const cases = [
        [type, '1.0.0', schema],
        [type, '1.3.0', schema],
        [type, '2.2.0', schema],
        [type, '2.2.1', null],
        ['bar', '2.2.0', null],
        [type, null, null]
      ]

      cases.forEach(([_type, ver, result], index) => {
        it('`get` returns proper value: #' + index, () => {
          expect(reg.get(_type, ver)).toBe(result)
        })

        it('`has` returns proper value: #' + index, () => {
          expect(reg.has(_type, ver)).toBe(!!result)
        })
      })
    })

    it('`flush` resets inner store', () => {
      expect(reg.store.length).toBe(1)
      expect(reg.flush()).toBe(reg)
      expect(reg.store.length).toBe(0)
    })
  })
})
