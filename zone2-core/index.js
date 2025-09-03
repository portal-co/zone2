import {_Proxy as $lM0mf$_Proxy, _WeakMap as $lM0mf$_WeakMap, _WeakMap_prototype as $lM0mf$_WeakMap_prototype, _Reflect as $lM0mf$_Reflect, snapshot as $lM0mf$snapshot} from "@portal-solutions/hooker-core";


const { isFrozen: $797764687fadb970$var$isFrozen } = Object;
function $797764687fadb970$var$trySet(obj, key, val) {
    if (!$797764687fadb970$var$isFrozen(obj)) obj[key] = val;
    return val;
}
const $797764687fadb970$var$globalThis_ = globalThis;
function $797764687fadb970$export$185802fd694ee1f5({ _Proxy: _Proxy = (0, $lM0mf$_Proxy), globalThis: globalThis1 = $797764687fadb970$var$globalThis_, _WeakMap: _WeakMap = (0, $lM0mf$_WeakMap), _WeakMap_prototype: _WeakMap_prototype = (0, $lM0mf$_WeakMap_prototype), _Reflect: _Reflect = (0, $lM0mf$_Reflect) } = {}) {
    return class Zone {
        static #current = undefined;
        static get current() {
            return this.#current;
        }
        static #setCurrent(targetZone) {
            this.#current = targetZone;
            while(targetZone && _WeakMap_prototype.has(this.#conflictResolver, targetZone)){
                const x = _WeakMap_prototype.get(this.#conflictResolver, targetZone);
                _WeakMap_prototype.remove(this.#conflictResolver, targetZone);
                x();
            }
            while(targetZone === undefined && this.#undefinedConflictResolver){
                const old = this.#undefinedConflictResolver;
                this.#undefinedConflictResolver = undefined;
                old();
            }
        }
        static #savedPromise = globalThis1.Promise;
        static #conflictResolver = new _WeakMap();
        static #proxyMap = new _WeakMap();
        #proxyMapInstance = new _WeakMap();
        static #proxyMapFor(zone) {
            if (zone === undefined) return Zone.#proxyMap;
            return zone.#proxyMapInstance;
        }
        static get #currentProxyMap() {
            return Zone.#proxyMapFor(Zone.#current);
        }
        static #undefinedConflictResolver = undefined;
        static #hookedPromise = $797764687fadb970$var$trySet(globalThis1, "Promise", new _Proxy(this.#savedPromise, {
            apply (target, thisArg, argArray) {
                if (argArray.length) argArray[0] = Zone.#hook(argArray[0]);
                return _Reflect.apply(target, thisArg, argArray);
            },
            construct (target, argArray, thisArg) {
                if (argArray.length) argArray[0] = Zone.#hook(argArray[0]);
                return _Reflect.construct(target, argArray, thisArg);
            }
        }));
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
        static #savedPromiseFinally = (0, $lM0mf$snapshot)(this.#hookedPromise.prototype.finally);
        static #enter(zone, func, type = "generic") {
            const old = Zone.#current;
            Zone.#setCurrent(zone);
            let disable = false;
            const resolve = ()=>{
                if (Zone.#current === zone) {
                    Zone.#setCurrent(old);
                    return;
                }
                if (zone === undefined) Zone.#undefinedConflictResolver = ()=>resolve();
                else _WeakMap_prototype.set(Zone.#conflictResolver, zone, resolve);
            };
            try {
                let value = func();
                if (value instanceof Zone.#hookedPromise) {
                    disable = true;
                    value = Zone.#savedPromiseFinally(value, resolve);
                }
                return value;
            } finally{
                if (!disable) resolve();
            }
        }
        static enter(zone, func) {
            if (zone !== undefined && !(zone instanceof Zone)) return zone.enter(func);
            return Zone.#enter(zone, func);
        }
        enter(func) {
            return Zone.#enter(this, func);
        }
        static #hook(object, type = "generic") {
            const snap = this.#current;
            if (typeof object === "function") {
                const old = object;
                object = new _Proxy(object, {
                    apply (target, thisArg, argArray) {
                        return Zone.#enter(snap, ()=>_Reflect.apply(target, thisArg, argArray), type);
                    }
                });
                // if (snap === undefined) {
                _WeakMap_prototype.set(Zone.#currentProxyMap, old, object);
            }
            return object;
        }
        static hook(object) {
            return this.#hook(object);
        }
        static{
            for (const promiseKey of [
                "then",
                "catch",
                "finally"
            ])$797764687fadb970$var$trySet(this.#hookedPromise.prototype, promiseKey, new _Proxy(this.#hookedPromise.prototype[promiseKey], {
                apply (target, thisArg, argArray) {
                    for(let i = 0; i < argArray.length; i++)argArray[i] = Zone.#hook(argArray[i]);
                    return _Reflect.apply(target, thisArg, argArray);
                }
            }));
            if ("EventTarget" in globalThis1 && typeof globalThis1.EventTarget === "object" && "prototype" in globalThis1.EventTarget && typeof globalThis1.EventTarget.prototype === "object" && "addEventListener" in globalThis1.EventTarget.prototype && "removeEventListener" in globalThis1.EventTarget.prototype && typeof globalThis1.EventTarget.prototype.addEventListener === "function" && typeof globalThis1.EventTarget.prototype.removeEventListener === "function") {
                $797764687fadb970$var$trySet(globalThis1.EventTarget.prototype, "addEventListener", new _Proxy(globalThis1.EventTarget.prototype.addEventListener, {
                    apply (target, thisArg, argArray) {
                        for(let i = 0; i < argArray.length; i++)argArray[i] = Zone.#hook(argArray[i]);
                        return _Reflect.apply(target, thisArg, argArray);
                    }
                }));
                $797764687fadb970$var$trySet(globalThis1.EventTarget.prototype, "removeEventListener", new _Proxy(globalThis1.EventTarget.prototype.removeEventListener, {
                    apply (target, thisArg, argArray) {
                        for(let i = 0; i < argArray.length; i++)if (typeof argArray[i] === "function") argArray[i] = _WeakMap_prototype.get(Zone.#currentProxyMap, argArray[i]) ?? argArray[i];
                        return _Reflect.apply(target, thisArg, argArray);
                    }
                }));
            }
        }
        constructor(){}
    };
}


export {$797764687fadb970$export$185802fd694ee1f5 as create};
//# sourceMappingURL=index.js.map
