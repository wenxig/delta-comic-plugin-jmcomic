import { Utils } from 'delta-comic-core'
import type { jm as JmType } from '..'
import { jmStore } from '@/store'
import { _jmComment } from '../comment'
import { jmStream } from './utils'

export namespace _jmApiComment {
  const { PromiseContent } = Utils.data
  export const getComicComment = PromiseContent.fromAsyncFunction(async (comicId: string, page: number = 1, signal?: AbortSignal) => {
    const all = (await jmStore.api.value!.get<{ list: JmType.comment.RawComment[], total: string }>('/forum', {
      params: {
        mode: 'manhua',
        page,
        aid: comicId
      },
      signal
    }))
    return { list: all.list.map(v => new _jmComment.Comment(v)), total: Number(all.total) }
  })
  export const createCommentsStream = (comicId: string) => jmStream((page, signal) => getComicComment(comicId, page, signal))

  export const sendComment = PromiseContent.fromAsyncFunction((comicId: string, content: string, isSpoiler: boolean, signal?: AbortSignal) => jmStore.api.value!.postForm('/comment', { aid: comicId, content, isSpoiler }, { signal }))
  export const sendChildComment = PromiseContent.fromAsyncFunction((comicId: string, parentCId: string, content: string, isSpoiler: boolean, signal?: AbortSignal) => jmStore.api.value!.postForm('/comment', { aid: comicId, content, isSpoiler, comment_id: parentCId }, { signal }))

  export const likeComment = PromiseContent.fromAsyncFunction((comicId: string, cid: string, signal?: AbortSignal) => jmStore.api.value!.postForm('/comment_vote', { aid: comicId, cid }, { signal }))
}