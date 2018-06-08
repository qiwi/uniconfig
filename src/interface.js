// @flow

export type IAny = any

export type IConfigOpts = {
  tolerateMissed?: boolean
}
export interface IConfig {
  constructor (path: string, opts: IConfigOpts): IConfig,
  opts: IConfigOpts,
  data: IAny,
  get (path: string): IAny
}
