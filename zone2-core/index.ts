import {
  _Proxy as _Proxy_,
  _Reflect,
  snapshot,
  _WeakMap,
  _WeakMap_prototype,
} from "@portal-solutions/hooker-core";
const { isFrozen } = Object;
function trySet<T, K extends keyof T>(obj: T, key: K, val: T[K]): T[K] {
  if (!isFrozen(obj)) obj[key] = val;
  return val;
}
const globalThis_: typeof globalThis = globalThis;
export interface ZoneProvider {
  new (): IZone;
  // awareProxy: typeof Proxy;
  unawareProxy: typeof Proxy;
  current: IZone | undefined;
  hook<T>(a: T): T;
}
export interface IZone {}
export interface Global {
  Promise: typeof Promise;
  // Proxy: typeof Proxy;
}
export function create({
  _Proxy = _Proxy_,
  globalThis = globalThis_,
}: {
  _Proxy?: typeof Proxy;
  globalThis: Global;
}): ZoneProvider {
  return class Zone implements IZone {
    static #current: Zone | undefined = undefined;
    static get current() {
      return this.#current;
    }
    static #setCurrent(a: Zone | undefined) {
      this.#current = a;
      while (a && _WeakMap_prototype.has(this.#conflictResolver, a)) {
        _WeakMap_prototype.get(this.#conflictResolver, a)();
        _WeakMap_prototype.remove(this.#conflictResolver, a);
      }
      while (a === undefined && this.#undefinedConflictResolver) {
        const old = this.#undefinedConflictResolver;
        this.#undefinedConflictResolver = undefined;
        old();
      }
    }
    static #savedPromise: typeof Promise = globalThis.Promise;
    static #conflictResolver: WeakMap<Zone, () => void> = new _WeakMap();
    static #proxyMap: WeakMap<any, any> = new _WeakMap();
    #proxyMapInstance: WeakMap<any, any> = new _WeakMap();
    static get #currentProxyMap() {
      return Zone.#current ? Zone.#current.#proxyMapInstance : Zone.#proxyMap;
    }
    static #undefinedConflictResolver: (() => void) | undefined = undefined;
    static #hookedPromise: typeof Promise = trySet(
      globalThis,
      "Promise",
      new _Proxy(this.#savedPromise, {
        apply(target, thisArg, argArray) {
          if (argArray.length) argArray[0] = Zone.#hook(argArray[0]);
          return _Reflect.apply(target, thisArg, argArray);
        },
        construct(target, argArray, thisArg) {
          if (argArray.length) argArray[0] = Zone.#hook(argArray[0]);
          return _Reflect.construct(target, argArray, thisArg);
        },
      })
    );
    // static #hookedProxy: typeof Proxy = trySet(globalThis, 'Proxy', new _Proxy(globalThis.Proxy, {
    //     construct(target, argArray, thisArg) {
    //         if (argArray.length >= 2) argArray[1] = {
    //             ...new _Proxy(argArray[1], {
    //                 get(object, key) {
    //                     return Zone.#hook(_Reflect.get(object, key));
    //                 }
    //             })
    //         };
    //         return _Reflect.construct(target, argArray, thisArg);
    //     }
    // }));
    // static get awareProxy() {
    //     return this.#hookedProxy;
    // }
    static get unawareProxy() {
      return _Proxy;
    }
    static #savedPromiseFinally = snapshot(
      this.#hookedPromise.prototype.finally
    );
    static #hook<T>(object: T): T {
      const snap = this.#current;
      if (typeof object === "function") {
        const old = object;
        object = new _Proxy(object, {
          apply(target, thisArg, argArray) {
            const old = Zone.#current;
            Zone.#setCurrent(snap);
            let disable = false;
            try {
              let value = _Reflect.apply(target, thisArg, argArray);
              if (value instanceof Zone.#hookedPromise) {
                disable = true;
                value = Zone.#savedPromiseFinally(
                  value,
                  ((async_impl) => () => {
                    if (Zone.#current === snap) {
                      Zone.#setCurrent(old);
                      return;
                    }
                    async_impl();
                  })(async () => {
                    for (;;) {
                      if (Zone.#current === snap) {
                        Zone.#setCurrent(old);
                        return;
                      } else {
                        await new Zone.#savedPromise((resolve) => {
                          if (snap === undefined) {
                            Zone.#undefinedConflictResolver = () =>
                              resolve(undefined);
                          } else {
                            _WeakMap_prototype.set(
                              Zone.#conflictResolver,
                              snap,
                              resolve
                            );
                          }
                        });
                      }
                    }
                  })
                );
              }
              return value;
            } finally {
              if (!disable) {
                Zone.#setCurrent(old);
              }
            }
          },
        });
        // if (snap === undefined) {
        _WeakMap_prototype.set(Zone.#currentProxyMap, old, object);
      }
      return object;
    }
    static hook<T>(object: T): T {
      return this.#hook(object);
    }
    static {
      for (const promiseKey of ["then", "catch", "finally"]) {
        trySet(
          this.#hookedPromise.prototype,
          promiseKey as any,
          new _Proxy(this.#hookedPromise.prototype[promiseKey], {
            apply(target, thisArg, argArray) {
              for (let i = 0; i < argArray.length; i++)
                argArray[i] = Zone.#hook(argArray[i]);
              return _Reflect.apply(target, thisArg, argArray);
            },
          })
        );
      }
      if (
        "EventTarget" in globalThis &&
        typeof globalThis.EventTarget === "object" &&
        "prototype" in globalThis.EventTarget &&
        typeof globalThis.EventTarget.prototype === "object" &&
        "addEventListener" in globalThis.EventTarget.prototype &&
        "removeEventListener" in globalThis.EventTarget.prototype &&
        typeof globalThis.EventTarget.prototype.addEventListener ===
          "function" &&
        typeof globalThis.EventTarget.prototype.removeEventListener ===
          "function"
      ) {
        trySet(
          globalThis.EventTarget.prototype,
          "addEventListener",
          new _Proxy(globalThis.EventTarget.prototype.addEventListener, {
            apply(target, thisArg, argArray) {
              for (let i = 0; i < argArray.length; i++)
                argArray[i] = Zone.#hook(argArray[i]);
              return _Reflect.apply(target, thisArg, argArray);
            },
          })
        );
        trySet(
          globalThis.EventTarget.prototype,
          "removeEventListener",
          new _Proxy(globalThis.EventTarget.prototype.removeEventListener, {
            apply(target, thisArg, argArray) {
              for (let i = 0; i < argArray.length; i++)
                if (typeof argArray[i] === "function")
                  argArray[i] =
                    _WeakMap_prototype.get(
                      Zone.#currentProxyMap,
                      argArray[i]
                    ) ?? argArray[i];
              return _Reflect.apply(target, thisArg, argArray);
            },
          })
        );
      }
    }
    constructor() {}
  };
}
