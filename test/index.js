import uniconfig from '../dist/es6'

describe('index', () => {
  it('exposes `uniconfig` api', () => {
    expect(uniconfig).toEqual(expect.any(Function))
  })
})
