import { pluginName } from "@/symbol"
import { uni } from "delta-comic-core"

export class JmPage {
  public static comicType = uni.content.ContentPage.toContentTypeString({
    name: 'comic',
    plugin: pluginName
  })
}