// zone2-core tests with mocked hooker-core
import { describe, it, expect } from 'vitest'

// Mock the external dependency before loading the module under test
vi.mock('@portal-solutions/hooker-core', () => ({
  _Proxy: class _Proxy {},
  _WeakMap: class _WeakMap {
    constructor() { this._data = new Map(); }
    has(key) { return this._data.has(key); }
    get(key) { return this._data.get(key); }
    set(key, value) { this._data.set(key, value); }
    delete(key) { this._data.delete(key); }
  },
  _WeakMap_prototype: {
    has: (map, key) => map.has(key),
    get: (map, key) => map.get(key),
    set: (map, key, value) => map.set(key, value),
    remove: (map, key) => map.delete(key),
  },
  _Reflect: Reflect,
  snapshot: (fn) => fn,
}));

const { create } = await import('../zone2-core/index.js')

describe('zone2-core', () => {
  it('basic create and enter flow', () => {
    const ZoneProvider = create()
    expect(typeof ZoneProvider).toBe('function')
    const z = new ZoneProvider()
    // initial current is undefined
    expect(ZoneProvider.current).toBeUndefined()

    const result = z.enter(() => {
      expect(ZoneProvider.current).toBe(z)
      return 7
    })

    expect(result).toBe(7)
    // after exit, current should revert to undefined
    expect(ZoneProvider.current).toBeUndefined()
  })
})
