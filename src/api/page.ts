import { pluginName } from "@/symbol"
import { uni, Utils } from "delta-comic-core"
import { jm } from "."
import { createCommonBlogToUniItem, createFullBlogToUniItem, createRecommendToUniItem } from "./api/utils"

export class JmComicPage extends uni.content.ContentPage {
  public static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'comic',
    plugin: pluginName
  })
  public override plugin = pluginName
  public override contentType = uni.content.ContentPage.toContentType(JmComicPage.contentType)
  public images = Utils.data.PromiseContent.withResolvers<uni.image.Image[]>()
  public override loadAll() {
    return Promise.all([
      this.detail.content.isLoading.value || this.detail.content.loadPromise(jm.api.comic.getComic(this.ep).then(v => {
        const comic: jm.comic.RawFullComic = v.$$meta.comic
        this.eps.resolve(comic.series.map(v => new uni.ep.Ep({
          $$plugin: pluginName,
          index: v.id,
          name: v.name,
          $$meta: {
            raw: v,
            from: 'page create'
          }
        })))
        this.recommends.resolve(comic.related_list.map(createRecommendToUniItem))
        this.pid.resolve(v.id)
        return v
      })),
      this.images.content.isLoading.value || this.images.content.loadPromise(jm.api.comic.getComicPages(this.id)),
    ])
  }
  public override comments = jm.api.comic.createCommentsStream(this.id)
  public override reloadAll(): any {
    throw new Error("Method not implemented.")
  }
  public override loadAllOffline(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  public override exportOffline(_save: any): Promise<void> {
    throw new Error("Method not implemented.")
  }
  public ViewComp
  constructor(preload: uni.content.PreloadValue, id: string, ep: string) {
    super(preload, id, ep)
    this.ViewComp = window.$view.images
  }
}


export class JmBlogPage extends uni.content.ContentPage {
  public static contentType = uni.content.ContentPage.toContentTypeString({
    name: 'blog',
    plugin: pluginName
  })
  public override plugin = pluginName
  public override contentType = uni.content.ContentPage.toContentType(JmBlogPage.contentType)
  public content = Utils.data.PromiseContent.withResolvers<string>()
  public override loadAll() {
    return Promise.all([
      this.detail.content.isLoading.value || this.detail.content.loadPromise(jm.api.blog.getInfo(this.ep).then(v => {
        const blog = createFullBlogToUniItem(v.info)
        this.eps.resolve([])
        this.recommends.resolve(v.related_blogs?.map(v => createCommonBlogToUniItem(v)) ?? [])
        this.recommendComics.resolve(v.related_comics?.map(v => createRecommendToUniItem(v)) ?? [])
        this.pid.resolve(blog.id)
        this.detail.resolve(blog)
        this.images.resolve([blog.$cover])
        this.uploader.resolve(new jm.user.BlogUser(blog.$$meta.raw))
        return blog
      }))
    ])
  }
  public uploader = Utils.data.PromiseContent.withResolvers<uni.user.User>()
  public recommendComics = Utils.data.PromiseContent.withResolvers<uni.item.Item[]>()
  public images = Utils.data.PromiseContent.withResolvers<uni.image.Image[]>()
  public override comments = jm.api.blog.createCommentsStream(this.id)
  public override reloadAll(): any {
    throw new Error("Method not implemented.")
  }
  public override loadAllOffline(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  public override exportOffline(_save: any): Promise<void> {
    throw new Error("Method not implemented.")
  }
  public ViewComp
  constructor(preload: uni.content.PreloadValue, id: string, ep: string) {
    super(preload, id, ep)
    this.ViewComp = window.$view.images
  }
}