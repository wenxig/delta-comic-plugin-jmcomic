import "@/index.css"
import { definePlugin, uni, Utils } from "delta-comic-core"
import { pluginName } from "./symbol"
import { AES, MD5, enc, mode } from 'crypto-js'
import { api, image } from "./api/forks"
import { inRange, isString } from 'lodash-es'
import axios from 'axios'
import { jmStore } from "./store"
import { jm } from "./api"
import { JmComicPage } from "./api/page"
import Card from "./components/card.vue"
import CommentRow from "./components/commentRow.vue"
import User from "./components/user.vue"
import Tabbar from "./components/tabbar.vue"
import WeekPromote from "./components/weekPromote.vue"
const testAxios = axios.create({
  timeout: 10000,
  method: 'GET',
  validateStatus(status) {
    return inRange(status, 199, 499)
  },
})
testAxios.interceptors.response.use(undefined, Utils.request.utilInterceptors.createAutoRetry(testAxios, 2))
definePlugin({
  name: pluginName,
  api: {
    api: {
      forks: () => Promise.resolve(api),
      test: (fork, signal) => testAxios.get(fork, { signal })
    }
  },
  image: {
    forks: {
      default: image
    },
    test: '/media/photos/1205243/00001.webp',
    process: {
      comicDecode: jm.image.decoder
    }
  },
  onBooted: ins => {
    console.log('setup...', ins, ins.api?.api)
    if (ins.api?.api) {
      const f = ins.api.api
      const api = Utils.request.createAxios(() => f, {}, ins => {
        ins.interceptors.request.use(requestConfig => {
          const authorization = jmStore.loginToken.value ?? ''
          const key = Date.now().toString()
          const token = MD5(`${key}185Hcomic3PAPP7R`).toString()
          const tokenParam = `${key},1.7.9`
          requestConfig.jm_key = key
          requestConfig.headers.set('Token', token)
          requestConfig.headers.set('Tokenparam', tokenParam)
          if (authorization) requestConfig.headers.set('Authorization', `Bearer ${authorization}`)
          const baseHeader = {
            Version: "v1.2.9",
            Cookie: `AVS=${jmStore.loginAvs.value || ''}`,
          }
          for (const key in baseHeader) {
            if (Object.prototype.hasOwnProperty.call(baseHeader, key)) {
              const element = baseHeader[<keyof typeof baseHeader>key]
              requestConfig.headers.set(key, element)
            }
          }
          return requestConfig
        })
        ins.interceptors.response.use(res => {
          const keyTemplates: string[] = [
            "185Hcomic3PAPP7R",
            "18comicAPPContent",
          ] // 预定义的密钥模板
          const decrypt = (cipherText: string) => {
            for (const template of keyTemplates) {
              try {
                const dynamicKey = MD5(`${res.config.jm_key}${template}`).toString()
                const decrypted = AES.decrypt(cipherText, enc.Utf8.parse(dynamicKey), {
                  mode: mode.ECB,
                })
                return JSON.parse(decrypted.toString(enc.Utf8))
              } catch (e) {
                // 尝试下一个密钥模板
                continue
              }
            }
            throw new Error("Decryption failed")
          }
          if (!res.data.data) return res
          if (isString(res.data.data)) res.data = decrypt(res.data.data)
          else res.data.data = res.data
          return res
        })
        return ins
      })
      jmStore.api.value = api
      Utils.eventBus.SharedFunction.define(s => jm.api.search.getRandomComics(s).then(v => v.list), pluginName, 'getRandomProvide')
    }
  },
  auth: {
    passSelect: async () => {
      console.log(jmStore.loginData)
      return (jmStore.loginData.value.password !== '') ? 'logIn' : false
    },
    async logIn(by) {
      if (jmStore.loginData.value.password !== '') var form = jmStore.loginData.value
      else var form = jmStore.loginData.value = await by.form({
        username: {
          type: 'string',
          info: '用户名'
        },
        password: {
          type: 'string',
          info: '密码'
        }
      })
      const res = await jm.api.auth.login(form)
      jmStore.loginToken.value = res.customUser.user.jwttoken
      jmStore.loginAvs.value = res.customUser.user.s
      jmStore.user.value = res
      console.log('login:', res, jmStore.user.value)
      uni.user.User.userBase.set(pluginName, jmStore.user.value!)
    },
    async signUp(by) {
      const form = await by.form({
        username: {
          type: 'string',
          info: '用户名'
        },
        email: {
          type: 'string',
          info: '用户名'
        },
        password: {
          type: 'string',
          info: '密码'
        },
        password_confirm: {
          type: 'string',
          info: '密码'
        },
        gender: {
          type: 'radio',
          comp: 'radio',
          info: '性别',
          selects: [{
            label: '男',
            value: 'Male'
          }, {
            label: '女',
            value: 'Female'
          }]
        },
      })
      await jm.api.auth.signUp({
        ...form,
        gender: <jm.user.Gender>form.gender
      })
      jmStore.loginData.value = {
        password: form.password,
        username: form.username
      }
      return await this.logIn(by)
    }
  },
  content: {
    contentPage: {
      [JmComicPage.contentType]: JmComicPage
    },
    layout: {
      [JmComicPage.contentType]: window.$layout.default
    },
    itemCard: {
      [JmComicPage.contentType]: Card
    },
    commentRow: {
      [JmComicPage.contentType]: CommentRow
    }
  },
  user: {
    card: User,
    edit: User,
  },
  otherProgress: [
    {
      name: '签到',
      async call(setDescription) {
        setDescription('签到中')
        try {
          await jm.api.user.dailyCheck()
          setDescription('签到成功')
        } catch (error) {
          setDescription('签到失败')
          throw error
        }
      }
    }, {
      name: '预加载数据',
      async call(setDescription) {
        setDescription('获取分类 & 推荐等...')
        try {
          const [cate, promote, wb, useredit] = await Promise.all([
            jm.api.search.getCategories(),
            jm.api.search.getPromote(),
            jm.api.search.getWeekBestList(),
            jm.api.user.getUser(jmStore.user.value?.id!)
          ])

          console.log('useredit', useredit)
          jmStore.useredit.value = useredit

          console.log('cate', cate)
          uni.content.ContentPage.setCategories(pluginName, ...cate.categories.filter(v => !!v.sub_categories).flatMap(v => v.sub_categories!.map(c => ({
            title: c.name,
            namespace: v.name,
            search: {
              methodId: '',
              input: '',
              sort: ''
            }
          }))), ...cate.blocks.flatMap(v => v.content.map(c => ({
            title: c,
            namespace: v.title,
            search: {
              methodId: '',
              input: '',
              sort: ''
            }
          }))))

          console.log('wb', wb)
          jmStore.wb.value = wb
          uni.content.ContentPage.setTabbar(pluginName, {
            comp: WeekPromote,
            id: 'weekPromote',
            title: '每周推荐'
          })

          console.log('promote', promote)
          jmStore.promotes.value = promote
          uni.content.ContentPage.setTabbar(pluginName, ...promote.map(v => ({
            title: v.title,
            id: v.id,
            comp: Tabbar
          })))
          setDescription('成功')
        } catch (error) {
          setDescription('失败')
          throw error
        }
      }
    }
  ]
})