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
  tolerateMissed?: boolean,
  emitter?: IEventEmitter
}
export interface IConfig {
  constructor (path: string, opts: IConfigOpts): IConfig,
  id: string,
  type: string,
  opts: IConfigOpts,
  data: IAny,
  emitter: IEventEmitter,
  registry: ISchemaRegistry,
  get (path: string): IAny,
  has (path: string): boolean,
  on (event: string, listener: IEventListener): IConfig,
  off (event: string, listener: IEventListener): IConfig,
  emit (event: string, data?: IAny): boolean
}

export type ILoaderOpts = IAny
export interface ILoader {
  sync(target: string, opts?: IAny): IAny,
  async(target: string, opts?: IAny): Promise<IAny>
}

export type IResolve = (value: IAny) => void
export type IReject = (value: IAny) => void
export interface IApi {}

export type ISourceStatus = 'initial' | 'processing' | 'ready' | 'failure'
export type IMode = 'sync' | 'async'
export type ISourceOpts = {
  mode: IMode,
  emitter: IEventEmitter,
  target: string,
  api?: ?IAny
}
export type IParser = (raw: IAny, opts?: ?IAny) => IAny

export type IParserEntry = {
  parser: IParser,
  type: string,
  condition: (type: string, raw: IAny) => boolean
}

export interface ISource {
  constructor(opts: ISourceOpts): ISource,
  type: string,
  id: string,
  status: ISourceStatus,
  mode: IMode,
  opts: IAny,
  parser: IParser,
  api: IAny,
  emitter: IEventEmitter,
  data?: IAny,

  setStatus(status: ISourceStatus, data?: ?IAny): ISource,
  connect(): ISource,
  on(event: string, listener: IEventListener): ISource,
  emit(event: string, data?: IAny): boolean,
  get(path: string): IAny,
  has(path: string): boolean,
}

export type ISchemaStoreItem = {
  type: string,
  schema: IAny,
  range: string
}
export type ISchemaStore = ISchemaStoreItem[]
export interface ISchemaRegistry {
  constructor(): ISchemaRegistry,
  add(type: string, range: string, schema: IAny): ISchemaRegistry,
  get(type: string, version: string): IAny,
  has(type: string, version: string): boolean,
  flush(): ISchemaRegistry
}

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
  api: any,
  processor: any,
  parser: IRegistry,
  source: any
}

export interface IPlugin {
  rollback(context: IContext): void,
  rollup(context: IContext): void
}
