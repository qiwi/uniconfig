import createContext, {Context} from '../src/context'
import apiRegistry from '../src/api/apiRegistry'
import parserRegistry from '../src/parser/parserRegistry'

describe('context', () => {
  describe('constructor', () => {
    it('returns proper instance', () => {
      const context = createContext()

      expect(context).toBeInstanceOf(Context)
      expect(context.api).toBe(apiRegistry)
      expect(context.parser).toBe(parserRegistry)
    })
  })
})
