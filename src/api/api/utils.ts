import { jm } from ".."
import { pluginName } from "@/symbol"
import { ceil, isEmpty, uniq } from "lodash-es"
import { JmComicPage } from "../page"
import { Utils } from "delta-comic-core"

export const spiltUsers = (userString = '') => userString.split(/\,|，|\&|\||、|＆|(\sand\s)|(\s和\s)|(\s[xX]\s)/ig).filter(Boolean).map(v => v.trim()).filter(Boolean)

export const createLessToUniItem = (comic: jm.comic.RawLessComic) => new jm.comic.JmItem({
  $$meta: {
    comic
  },
  $$plugin: pluginName,
  author: [],
  categories: comic.tags.split(' ').filter(v => !isEmpty(v)),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/media/albums/${comic.id}_3x4.jpg`
  },
  title: comic.name,
  id: comic.id,
  isLiked: comic.liked,
  updateTime: Number(comic.addtime),
  customIsAI: false,
  contentType: JmComicPage.contentType,
  length: '',
  epLength: comic.series.length.toString(),
  thisEp: {
    $$plugin: pluginName,
    name: comic.series.find(v => v.sort == comic.series_id)!.name,
    index: comic.series_id
  },
  commentSendable: true
})

export const createCommonToUniItem = (comic: jm.comic.RawCommonComic) => new jm.comic.JmItem({
  $$meta: {
    comic
  },
  $$plugin: pluginName,
  author: spiltUsers(comic.author),
  categories: uniq([comic.category.title ?? '', comic.category_sub.title ?? '']),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/media/albums/${comic.id}_3x4.jpg`
  },
  title: comic.name,
  id: comic.id,
  isLiked: comic.liked,
  updateTime: comic.update_at && Number(comic.update_at),
  customIsAI: false,
  contentType: JmComicPage.contentType,
  length: '',
  epLength: '',
  thisEp: {
    $$plugin: pluginName,
    name: comic.name,
    index: comic.id
  },
  commentSendable: true
})

export const createRecommendToUniItem = (comic: jm.comic.RawRecommendComic) => new jm.comic.JmItem({
  $$meta: {
    comic
  },
  $$plugin: pluginName,
  author: spiltUsers(comic.author),
  categories: [],
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/media/albums/${comic.id}_3x4.jpg`
  },
  title: comic.name,
  id: comic.id,
  customIsAI: false,
  contentType: JmComicPage.contentType,
  length: '',
  epLength: '',
  thisEp: {
    $$plugin: pluginName,
    name: comic.name,
    index: comic.id
  },
  commentSendable: true
})

export const createFullToUniItem = (comic: jm.comic.RawFullComic) => new jm.comic.JmItem({
  $$meta: {
    comic
  },
  $$plugin: pluginName,
  author: comic.author,
  categories: comic.tags.concat(comic.works.map(v => `作品:${v}`), comic.actors.map(v => `角色:${v}`)),
  cover: {
    $$plugin: pluginName,
    forkNamespace: 'default',
    path: `/media/albums/${comic.id}_3x4.jpg`
  },
  title: comic.name,
  id: comic.id,
  customIsAI: false,
  contentType: JmComicPage.contentType,
  length: comic.images.length.toString(),
  epLength: comic.series.length.toString(),
  thisEp: {
    $$plugin: pluginName,
    name: comic.name,
    index: comic.id
  },
  commentSendable: true,
  description: comic.description,
  commentNumber: Number(comic.comment_total),
  isLiked: comic.liked,
  likeNumber: Number(comic.likes),
  updateTime: Number(comic.addtime),
  viewNumber: Number(comic.total_views)
})

export const jmStream = <T>(api: (page: number, signal: AbortSignal) => PromiseLike<{ list: T[], total: number }>) => Utils.data.Stream.create<T>(async function* (signal, that) {
  while (true) {
    if (that.pages.value <= that.page.value) return
    that.page.value++
    const { list: result, total } = await api(that.page.value, signal)
    if (that.page.value == 1) that.pageSize.value = result.length
    that.total.value = total
    // eg: total: 300 result: 60 pages: t/r向上取整
    that.pages.value = ceil(total / that.pageSize.value)
    yield result
  }
})