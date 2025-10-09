import { Utils } from 'delta-comic-core'
import type { jm as JmType } from '..'
import { jmStore } from '@/store'
import { _jmComment } from '../comment'
import { jmStream } from './utils'

export namespace _jmApiComment {
  const { PromiseContent } = Utils.data
  export const getComicComment = PromiseContent.fromAsyncFunction(async (comicId: string, page: number = 1, signal?: AbortSignal) => {
    const all = (await jmStore.api.get<{ list: JmType.comment.RawComment[], total: unknown }>('/forum', {
      params: {
        mode: 'manhua',
        page,
        aid: comicId
      },
      signal
    })).list
    return all.map(v => new _jmComment.Comment(v, all))
  })
  export const createCommentsStream = (comicId: string) => jmStream((page, signal) => getComicComment(comicId, page, signal))

  export const sendComment = PromiseContent.fromAsyncFunction((comicId: string, content: string, isSpoiler: boolean, signal?: AbortSignal) => jmStore.api.postForm('/comment', { aid: comicId, content, isSpoiler }, { signal }))
  export const sendChildComment = PromiseContent.fromAsyncFunction((comicId: string, parentCId: string, content: string, isSpoiler: boolean, signal?: AbortSignal) => jmStore.api.postForm('/comment', { aid: comicId, content, isSpoiler, comment_id: parentCId }, { signal }))
}