export type IAny = any
export type IAnyObject = {
  [key: string]: IAny
}

export type IWindow = {document: IAny} | void

export type IEvent = {
  type: string,
  data?: IAny
}
export type IEventListener = (...args: IAny[]) => IAny
export interface IEventEmitter {
  on(event: string, listener: IEventListener): IEventEmitter,
  removeListener(event: string, listener: IEventListener): IEventEmitter,
  emit(event: string, ...args: IAny[]): boolean,
  once(event: string, listener: IEventListener): IEventEmitter
}

export type IInjectRule = {
  from: string | RegExp,
  to: any
}
export type IInject = IInjectRule | string
export type IInjectsMap = {
  [key: string]: IInject
}

export interface IConfigLegacyOpts {
  tolerateMissed?: boolean,
  emitter?: IEventEmitter,
  mode?: IMode,
  pipeline?: IPipeline
}

export interface IConfigOpts extends IConfigLegacyOpts {
  data?: IAny,
  tolerateMissed?: boolean,
  emitter?: IEventEmitter,
  mode?: IMode,
  pipeline?: IPipeline,
  injects?: IInjectsMap,
  context?: IContext
}

export type IConfigPromise = Promise<IConfig>
export type IConfigInput = IAny

export type IIntention = {
  promise: IConfigPromise,
  resolve: Function,
  reject: Function
}

export interface IConfig {
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

  add(name: string, item: IRegistryItem): void,
  get(name: string): IRegistryItem | undefined,
  find(...args: IAny[]): IRegistryItem | undefined,
  has(name: string): boolean,
  remove(name: string): void,
  flush(): void
}

export interface IContext {
  pipe: IRegistry
}

export type IRollup = (context: IContext) => void
export type IRollback = (context: IContext) => void

export type IPlugin = {
  rollback: IRollup,
  rollup: IRollback,
  [key: string]: any
}

export enum IEnvType {
  BROWSER = 'browser',
  NODE = 'node',
  ANY = 'any',
}

export type IPipe = {
  handle(context: IContext, data?: IAny, ...opts: IAny[]): Promise<IAny>,
  handleSync(context: IContext, data?: IAny, ...opts: IAny[]): IAny,
  name?: string,
  env?: IEnvType
}

export type INamedPipe = {
  handle(context: IContext, data?: IAny, ...opts: IAny[]): Promise<IAny>,
  handleSync(context: IContext, data?: IAny, ...opts: IAny[]): IAny,
  name: string,
  env?: IEnvType,
  [key: string]: any
}

export type IPluginDeclaration = IPlugin | INamedPipe

export type IPipeEquation = string
export type IPipeRef = string
export type IPipeOpts = IAny
export type IPipeRefExt = [IPipeRef] | [IPipeRef, IPipeOpts] | [IPipeRef, IPipeOpts, IPipeOpts]  | [IPipeRef, IPipeOpts, IPipeOpts, IPipeOpts]
export type IPipeLink = IPipeRef | IPipeRefExt
export type IPipeChain = Array<IPipeLink>
export type IPipeline = IPipeEquation | IPipeChain
