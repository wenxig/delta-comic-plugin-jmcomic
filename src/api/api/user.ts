import { uni, Utils } from 'delta-comic-core'
import type { jm as JmType } from '..'
import { jmStore } from '@/store'
import { pluginName } from '@/symbol'
import { createCommonToUniItem, jmStream } from './utils'
import type { _jmUser } from '../user'

export namespace _jmApiUser {
  const { PromiseContent } = Utils.data
  export const buyBadge = PromiseContent.fromAsyncFunction((badgeId: number, signal?: AbortSignal) => {
    const user = uni.user.User.userBase.get(pluginName)
    if (!user) throw new Error('not login')
    return jmStore.api.value!.post('/coin', {
      uid: user.id,
      task_id: badgeId
    }, { signal })
  })
  export const createFavouriteStream = () => jmStream(async (page, signal) => {
    const { list, total } = await jmStore.api.value!.get<{
      list: JmType.comic.RawCommonComic[],
      folder_list: {
        FID: string
        UID: string
        name: string
      }[],
      total: string
      count: number
    }>('/favorite', { params: { page, folder_id: 0, o: 'mr' }, signal })
    return { list: list.map(createCommonToUniItem), total: Number(total) }
  })

  export const dailyCheck = PromiseContent.fromAsyncFunction(async (signal?: AbortSignal) => {
    const user = jmStore.user.value
    const dailyInfo = await jmStore.api.value!.get<{
      daily_id: number
    }>(`/daily?user_id=${user?.id}`, { signal })
    try {
      await jmStore.api.value!.post(`/daily_chk?user_id=${user?.id}&daily_id=${dailyInfo.daily_id}`, undefined, { signal })
    } catch { }
  })

  //useredit
  export const getUser = PromiseContent.fromAsyncFunction((uid: number | string, signal?: AbortSignal) =>
    jmStore.api.value!.get<_jmUser.UserEdit>(`/useredit/${uid}`, { signal })
  )

  export const setUser = PromiseContent.fromAsyncFunction((uid: number | string, user: _jmUser.UserEdit, signal?: AbortSignal) =>
    jmStore.api.value!.postForm(`/useredit/${uid}`, user, { signal })
  )
} 