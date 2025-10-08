import { type useMessage, type useLoadingBar, type useDialog } from 'naive-ui'
import type { Router } from 'vue-router'
import type { ExternalLibKey } from './external'
declare global {
  interface Window {
    $message: ReturnType<typeof useMessage>
    $loading: ReturnType<typeof useLoadingBar>
    $dialog: ReturnType<typeof useDialog>
    $api: Record<string, any>
    $$lib$$: any
    $$safe$$: boolean
    $layout: Record<string, uni.content.ViewLayoutComp>
  }
  interface Map<K, V> {
    toJSON(): string
    toJSONObject(): [K, V][]
  }
  interface Set<T> {
    toJSON(): string
    toJSONObject(): T[]
  }
}
export declare module 'axios' {
  interface AxiosRequestConfig {
    __retryCount?: number
    disretry?: boolean
  }
}

export { }