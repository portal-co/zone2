import { _WeakMap, _WeakMap_prototype } from "@portal-solutions/hooker-core";
export interface ZoneProvider {
    new (): IZone;
    unawareProxy: typeof Proxy;
    current: IZone | undefined;
    hook<T>(a: T): T;
    enter<T>(zone: IZone | undefined, func: () => T): T;
}
export interface IZone {
    enter<T>(fn: () => T): T;
}
export interface Global {
    Promise: typeof Promise;
}
export type CreateOpts = {
    _Proxy?: typeof Proxy;
    globalThis?: Global;
    _WeakMap?: typeof _WeakMap;
    _WeakMap_prototype?: typeof _WeakMap_prototype;
    _Reflect?: typeof Reflect;
};
export function create({ _Proxy, globalThis, _WeakMap, _WeakMap_prototype, _Reflect, }?: CreateOpts): ZoneProvider;

//# sourceMappingURL=index.d.ts.map
