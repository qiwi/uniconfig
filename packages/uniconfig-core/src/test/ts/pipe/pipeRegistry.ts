import pipeRegistry from '../../../main/ts/pipe/pipeRegistry'
import AbstractRegistry from '../../../main/ts/base/abstractRegistry'

describe('pipe/pipeRegistry', () => {
  describe('has proper inners', () => {
    expect(pipeRegistry.type).toBe('pipe')
  })

  describe('proto', () => {
    ['add', 'get', 'remove', 'flush', 'has', 'find'].map(method => {
      it('`' + method + '` inherited from AbstractRegistry', () => {
        expect(pipeRegistry[method]).toBe(AbstractRegistry.prototype[method])
      })
    })
  })
})
