import detector, { JSON as Json, YAML } from '../../src/parser/detector'

describe('detector', () => {
  it('detect yaml input', () => {
    const str = `
        foo: bar
        baz: 1
      `
    expect(detector(str)).toBe(YAML)
  })

  it('detect json input', () => {
    const value = { foo: 'bar' }
    const str = JSON.stringify(value)
    expect(detector(str)).toBe(Json)
  })

  it('detect other as typeof', () => {
    expect(detector(1)).toBe('number')
  })
})
