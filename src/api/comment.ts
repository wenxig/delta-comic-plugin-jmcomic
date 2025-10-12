import { _jmUser } from "./user"
import { _jmImage } from "./image"
import DOMPurify from 'dompurify'
import { uni, Utils } from "delta-comic-core"
import { pluginName } from "@/symbol"
import { isEmpty } from "lodash-es"
import { jm } from "."
export namespace _jmComment {
  export interface RawComment {
    AID: string
    BID: string
    CID: string
    UID: string
    username: string
    nickname: string
    likes: string
    gender: _jmUser.Gender
    update_at: string
    addtime: string
    parent_CID: string
    expinfo: _jmUser.RawExpInfo
    name: string
    content: string
    photo: string
    spoiler: string
    replys?: RawComment[]
  }
  export class Comment extends uni.comment.Comment {
    override sender: _jmUser.CommentUser
    override like(signal?: AbortSignal): PromiseLike<boolean> {
      window.$message.error("Method not implemented.")
      return Promise.resolve(false)
    }
    override report(signal?: AbortSignal): PromiseLike<any> {
      window.$message.error("Method not implemented.")
      return Promise.resolve(undefined)
    }
    override sendComment(text: string, signal?: AbortSignal): PromiseLike<any> {
      const raw: RawComment = this.$$meta!.raw
      if (isEmpty(raw.parent_CID)) {
        return jm.api.comment.sendComment(raw.AID, text, false, signal)
      }
      return jm.api.comment.sendChildComment(raw.AID, raw.parent_CID, text, false, signal)
    }
    override children
    constructor(v: RawComment) {
      const sender = new _jmUser.CommentUser(v)
      super({
        $$plugin: pluginName,
        childrenCount: v.replys?.length ?? 0,
        content: {
          text: DOMPurify.sanitize(v.content),
          type: 'html'
        },
        id: v.CID,
        isLiked: false,
        isTop: false,
        likeCount: Number(v.likes),
        reported: false,
        sender,
        time: Number(v.addtime),
        $$meta: {
          raw: v
        }
      })
      this.sender = sender
      this.children = Utils.data.Stream.create<Comment>(function* () {
        yield v.replys?.map(v => new Comment(v)) ?? []
      })
    }
  }
}