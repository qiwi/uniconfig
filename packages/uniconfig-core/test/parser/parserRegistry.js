import parserRegistry from '../../src/parser/parserRegistry'
import AbstractRegistry from '../../src/base/abstractRegistry'

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
