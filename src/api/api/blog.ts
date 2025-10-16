import { uni, Utils } from 'delta-comic-core'
import type { jm as JmType } from '..'
import { jmStore } from '@/store'

export namespace _jmApiBlog {
  const { PromiseContent } = Utils.data
  export const likeBlog = PromiseContent.fromAsyncFunction((id: string, signal?: AbortSignal) => jmStore.api.value!.postForm('/like', { id, like_type: "blog" }, { signal }))
}