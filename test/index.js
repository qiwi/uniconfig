import uniconfig from '../dist'

describe('index', () => {
  it('exposes `uniconfig` api', () => {
    expect(uniconfig).toEqual(expect.any(Function))
  })
})
