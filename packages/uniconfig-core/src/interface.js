// @flow

export type IAny = any

export type IWindow = {document: IAny} | void

export type IEvent = {
  type: string,
  data?: IAny
}
export type IEventListener = (...args?: IAny[]) => IAny
export interface IEventEmitter {
  constructor(): ?IEventEmitter,
  on(event: string, listener: IEventListener): IEventEmitter,
  removeListener(event: string, listener: IEventListener): IEventEmitter,
  emit(event: string, ...args?: IAny[]): boolean,
  once(event: string, listener: IEventListener): IEventEmitter
}

export type IConfigOpts = {
  data?: IAny,
  tolerateMissed?: boolean,
  emitter?: IEventEmitter,
  mode?: IMode,
  pipeline?: IPipeline
}

export type IConfigLegacyOpts = {
  tolerateMissed?: boolean,
  emitter?: IEventEmitter,
  mode?: IMode,
  pipeline?: IPipeline
}

export type IConfigPromise = Promise<IConfig>
export type IConfigInput = IAny

export type IIntention = {
  promise: IConfigPromise,
  resolve: Function,
  reject: Function
}

export interface IConfig {
  constructor (input: IConfigInput | IConfigOpts, legacyOpts?: IConfigLegacyOpts): IConfig,
  id: string,
  type: string,
  opts: IConfigOpts,
  data: IAny,
  emitter: IEventEmitter,
  context: IContext,
  intention: IIntention,
  ready: IConfigPromise,
  get (path: string): IAny,
  has (path: string): boolean,
  on (event: string, listener: IEventListener): IConfig,
  off (event: string, listener: IEventListener): IConfig,
  emit (event: string, data?: IAny): boolean,
  setData (data: IAny): IConfig
}

export type IResolve = (value: IAny) => void
export type IReject = (value: IAny) => void

export type IMode = 'sync' | 'async'

export type IRegistryItem =  IAny
export type IRegistryStore = {
  [key: string]: IRegistryItem
}
export interface IRegistry {
  type: string,
  store: IRegistryStore,

  constructor(): IRegistry,
  add(name: string, item: IRegistryItem): void,
  get(name: string): ?IRegistryItem,
  find(...args: IAny): ?IRegistryItem,
  has(name: string): boolean,
  remove(name: string): void,
  flush(): void
}

export interface IContext {
  pipe: IRegistry
}

export interface IPlugin {
  rollback(context: IContext): void,
  rollup(context: IContext): void
}

export type IPipe = {
  handle(data: IAny, opts?: IAny): Promise<IAny>,
  handleSync(data: IAny, opts?: IAny): IAny
}
export type IPipeEquation = string
export type IPipeRef = string
export type IPipeOpts = IAny
export type IPipeRefExt = [IPipeRef, ?IPipeOpts, ?IPipeOpts, ?IPipeOpts]
export type IPipeLink = IPipeRef | IPipeRefExt
export type IPipeChain = Array<IPipeLink>
export type IPipeline = IPipeEquation | IPipeChain
