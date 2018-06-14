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
  opts: IConfigOpts,
  data: IAny,
  emitter: IEventEmitter,
  get (path: string): IAny,
  has (path: string): boolean,
  on (event: string, listener: IEventListener): IConfig,
  off (event: string, listener: IEventListener): IConfig,
  emit (event: string, data?: IAny): boolean
}
