import apiRegistry from '../../src/api/apiRegistry'
import AbstractRegistry from '../../src/core/abstractRegistry'

describe('api/apiRegistry', () => {
  describe('has proper inners', () => {
    expect(apiRegistry.type).toBe('api')
  })

  describe('proto', () => {
    ['add', 'get', 'remove', 'flush', 'has', 'find'].map(method => {
      it('`' + method + '` inherited from AbstractRegistry', () => {
        expect(apiRegistry[method]).toBe(AbstractRegistry.prototype[method])
      })
    })
  })
})
