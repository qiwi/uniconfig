declare module 'browser-or-node/lib/index' {
  export const isBrowser: boolean;
  export const isNode: boolean;
  export const isWebWorker: boolean;
}

declare module 'browser-or-node' {
  export * from 'browser-or-node/lib/index'
}
