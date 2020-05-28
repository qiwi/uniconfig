import { echo, deepMap } from '../../../main/ts/base/util'

describe('base/util', () => {
  it('`echo` returns input as a result', () => {
    const foo = {}
    expect(echo(foo)).toBe(foo)
  })

  describe('deepMap', () => {
    it('work with circular deps', () => {
      const a = {
        b: 10,
      }
      // @ts-ignore
      a.c = a

      // @ts-ignore
      expect(deepMap(a, (el)=>el*10).c.c.c.c.c.b).toBe(100)
    })

    it('return value without cb', () => {
      const value = 'foo'
      // @ts-ignore
      expect(deepMap(value)).toBe(value)
    })
  })
})
