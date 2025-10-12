import { uni, Utils } from 'delta-comic-core'
import type { jm as JmType } from '..'
import { jmStore } from '@/store'
import { pluginName } from '@/symbol'
import { createCommonToUniItem, jmStream } from './utils'

export namespace _jmApiUser {
  const { PromiseContent } = Utils.data
  export const buyBadge = PromiseContent.fromAsyncFunction((badgeId: number) => {
    const user = uni.user.User.userBase.get(pluginName)
    if (!user) throw new Error('not login')
    return jmStore.api.value!.post('/coin', {
      uid: user.id,
      task_id: badgeId
    })
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

  export const dailyCheck = PromiseContent.fromAsyncFunction(async () => {
    const user = jmStore.user.value
    const dailyInfo = await jmStore.api.value!.get<{
      daily_id: number
    }>(`/daily?user_id=${user?.id}`)
    try {
      await jmStore.api.value!.post(`/daily_chk?user_id=${user?.id}&daily_id=${dailyInfo.daily_id}`)
    } catch { }
  })
} 