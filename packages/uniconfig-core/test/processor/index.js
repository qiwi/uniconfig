import processor from '../../src/processor'

describe('processor', () => {
  it('properly parses meta', () => {
    const meta = {}
    expect(processor(meta)).toBe(meta)
  })
})
