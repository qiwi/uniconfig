import {
  echo,
  registry,
  executor,
} from '../../../main/ts/pipe'

describe('index', () => {
  it('export correctly', () => {
    expect(echo).toBeDefined()
    expect(registry).toBeDefined()
    expect(executor).toBeDefined()
  })
})
