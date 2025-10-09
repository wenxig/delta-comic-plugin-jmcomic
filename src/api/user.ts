import { uni } from "delta-comic-core"
import type { _jmComment } from "./comment"
import { _jmImage } from "./image"
import { pluginName } from "@/symbol"

export namespace _jmUser {
  export type Gender = "Male" | "Female"
  export interface RawBadge {
    content: string
    id: string
    name: string
  }
  export class Badge implements RawBadge {
    public content: string
    public get $content() {
      return uni.image.Image.create({
        $$plugin: pluginName,
        forkNamespace: 'default',
        path: this.content
      })
    }
    public id: string
    public name: string
    constructor(v: RawBadge) {
      this.content = v.content
      this.id = v.id
      this.name = v.name
    }
  }

  export interface RawExpInfo {
    level_name: string
    level: number
    nextLevelExp: string
    exp: string
    expPercent: number
    uid: string
    badges: RawBadge[]
  }
  export class ExpInfo implements RawExpInfo {
    public level_name: string
    public level: number
    public nextLevelExp: string
    public get $nextLevelExp() {
      return Number(this.nextLevelExp)
    }
    public exp: string
    public get $exp() {
      return Number(this.exp)
    }
    public expPercent: number
    public uid: string
    public get $uid() {
      return Number(this.uid)
    }
    public badges: RawBadge[]
    public get $badges() {
      return this.badges.map(v => new Badge(v))
    }
    constructor(v: RawExpInfo) {
      this.level_name = v.level_name
      this.level = v.level
      this.nextLevelExp = v.nextLevelExp
      this.exp = v.exp
      this.expPercent = v.expPercent
      this.uid = v.uid
      this.badges = v.badges
    }
  }

  export interface RawUserMe extends RawExpInfo {
    ad_free: boolean
    ad_free_before: string
    album_favorites: number
    album_favorites_max: number
    charge: string
    coin: number
    email: string
    emailverified: string
    fname: string
    gender: Gender
    invitation_qrcode: string
    invitation_url: string
    invited_cnt: string
    jar: string
    jwttoken?: string
    message: string
    photo: string
    s: string
    username: string
  }
  export class UserMe extends uni.user.User {
    override customUser
    constructor(v: RawUserMe) {
      super({
        id: v.uid,
        name: v.username,
        avatar: {
          $$plugin: pluginName,
          forkNamespace: 'default',
          path: `/media/users/${v.uid}.jpg`
        }
      })
      this.customUser = {
        user: v,
        expInfo: new ExpInfo(v)
      }
    }
  }

  export class CommentUser extends uni.user.User {
    override customUser
    constructor(c: _jmComment.RawComment) {
      super({
        id: c.UID,
        name: c.username,
        avatar: {
          $$plugin: pluginName,
          forkNamespace: 'default',
          path: `/media/users/${c.UID}.jpg`
        }
      })
      this.customUser = {
        user: c,
        expInfo: new ExpInfo(c.expinfo)
      }
    }
  }
}



