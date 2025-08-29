export interface ZoneProvider {
    new (): IZone;
    unawareProxy: typeof Proxy;
    current: IZone | undefined;
    hook<T>(a: T): T;
}
export interface IZone {
}
export interface Global {
    Promise: typeof Promise;
}
export function create({ _Proxy, globalThis, }: {
    _Proxy?: typeof Proxy;
    globalThis: Global;
}): ZoneProvider;

//# sourceMappingURL=index.d.ts.map
