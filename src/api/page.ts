import { pluginName } from "@/symbol"
import { uni, Utils } from "delta-comic-core"
import { jm } from "."
import { createRecommendToUniItem } from "./api/utils"
import View from "@/components/view.vue"

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
      this.detail.content.isLoading.value || jm.api.comic.getComic(this.ep).then(v => {
        const comic: jm.comic.RawFullComic = v.$$meta.comic
        this.detail.resolve(v)
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
      }),
      this.images.content.isLoading.value || jm.api.comic.getComicPages(this.id).then(async v => this.images.resolve(v)),
    ])
  }
  public override comments = jm.api.comment.createCommentsStream(this.id)
  public override reloadAll(): any {
    throw new Error("Method not implemented.")
  }
  public override loadAllOffline(): Promise<any> {
    throw new Error("Method not implemented.")
  }
  public override exportOffline(_save: any): Promise<void> {
    throw new Error("Method not implemented.")
  }
  public override ViewComp = View
  constructor(preload: uni.content.PreloadValue, id: string, ep: string) {
    super(preload, id, ep)
  }
}