import { echo } from '../../src/base/util'

describe('base/util', () => {
  it('`echo` returns input as a result', () => {
    const foo = {}
    expect(echo(foo)).toBe(foo)
  })
})
