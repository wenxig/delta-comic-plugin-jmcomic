import { type jm as JmType } from '..'
import { random } from "lodash-es"
import { Utils } from "delta-comic-core"
import { jmStore } from '@/store'
import { createCommonToUniItem, jmStream } from './utils'
import { _jmSearch } from '../search'
const decodeURI = (url: string) => {
  let last = url
  do {
    url = window.decodeURI(url)
    if (last == url) break
    last = url
  } while (url.includes('%'))
  return url
}

export namespace _jmApiSearch.utils {
  const { PromiseContent } = Utils.data
  export const byKeyword = PromiseContent.fromAsyncFunction((searchQuery: string, order: JmType.SortType = "", page = 1, signal?: AbortSignal) =>
    jmStore.api.value!.get<JmType.search.ByKeyword>('/search', { signal, params: { search_query: encodeURIComponent(decodeURI(searchQuery)), page, o: order } })
      .then<{
        list: JmType.comic.JmItem[]
        total: number
      }>(v => ({ list: v.content.map(createCommonToUniItem), total: Number(v.total) })))
  export const createKeywordStream = (searchQuery: string, order: JmType.SortType = "") => jmStream((page, signal) => byKeyword(searchQuery, order, page, signal))

  export const byCategory = PromiseContent.fromAsyncFunction((c: string, order: JmType.SortType = '', page = 1, signal?: AbortSignal) =>
    jmStore.api.value!.get<JmType.search.ByCategory>('/categories/filter', { signal, params: { c: (c), page, o: order } }).then<{
      list: JmType.comic.JmItem[]
      total: number
    }>(v => ({ list: v.content.map(createCommonToUniItem), total: Number(v.total) })))
  export const createCategoryStream = (c: string, order: JmType.SortType = "") => jmStream((page, signal) => byCategory(c, order, page, signal))
}

export namespace _jmApiSearch {
  const { PromiseContent } = Utils.data
  export const getPromote = PromiseContent.fromAsyncFunction((signal?: AbortSignal) =>
    jmStore.api.value!.get<JmType.search.RawPromote[]>(`/promote`, { signal, params: { page: 1 } }).then<_jmSearch.Promote[]>(v => v.map(v => new _jmSearch.Promote(v))))
  export const getPromoteItem = PromiseContent.fromAsyncFunction((id: number, page = 1, signal?: AbortSignal) =>
    jmStore.api.value!.get<JmType.search.PromoteItem>(`/promote_list`, { signal, params: { page, id } }).then<{
      list: JmType.comic.JmItem[]
      total: number
    }>(v => ({ list: v.list.map(createCommonToUniItem), total: Number(v.total) })))
  export const createPromoteStream = (id: number) => jmStream((page, signal) => getPromoteItem(id, page, signal))

  export const getWeekBestList = PromiseContent.fromAsyncFunction((signal?: AbortSignal) => jmStore.api.value!.get<JmType.search.WeekBestList>('/week', { signal }))
  export const getWeekBestComic = PromiseContent.fromAsyncFunction((id: number, type: string, signal?: AbortSignal) =>
    jmStore.api.value!.get<JmType.search.WeekBestItem>(`/week/filter`, { signal, params: { type, id } }).then<{
      list: JmType.comic.JmItem[]
      total: number
    }>(v => ({ list: v.list.map(createCommonToUniItem), total: Number(v.total) })))

  export const getRandomComics = PromiseContent.fromAsyncFunction(async (signal?: AbortSignal) => await _jmApiSearch.utils.byCategory('', undefined, random(1, 100), signal))
  export const createRandomComicStream = () => jmStream((_page, signal) => getRandomComics(signal))

  let lvb: PromiseLike<[JmType.comic.JmItem[], JmType.comic.JmItem[], JmType.comic.JmItem[]]> | undefined = undefined
  export const getLevelboard = PromiseContent.fromAsyncFunction(async () => {
    if (lvb) {
      const lv = await lvb
      return <JmType.search.Levelboard>{
        day: lv[0],
        week: lv[1],
        month: lv[2]
      }
    }
    const [today, week, month] = await (lvb = Promise.all([
      _jmApiSearch.utils.byCategory('', 'mv_t').then(v => v.list),
      _jmApiSearch.utils.byCategory('', 'mv_w').then(v => v.list),
      _jmApiSearch.utils.byCategory('', 'mv_m').then(v => v.list)
    ]))
    return <JmType.search.Levelboard>{
      day: today,
      week,
      month
    }
  })

  export const getCategories = PromiseContent.fromAsyncFunction((signal?: AbortSignal) => jmStore.api.value!.get<JmType.search.CategoriesResult>('/categories', { signal }))
}
