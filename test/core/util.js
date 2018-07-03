import {echo} from '../../src/core/util'

describe('core/util', () => {
  it('`echo` returns input as a result', () => {
    const foo = {}
    expect(echo(foo)).toBe(foo)
  })
})
