import "@/index.css"
import { definePlugin, Utils } from "delta-comic-core"
import { pluginName } from "./symbol"
import { AES, MD5, enc, mode } from 'crypto-js'
import { apiGetter, image } from "./api/forks"
import { inRange, isEmpty, isString } from 'lodash-es'
import axios from 'axios'
import { jmStore } from "./store"
import { jm } from "./api"
const apiGetterAxios = Utils.request.createAxios(() => '', {}, api => {
  api.interceptors.response.use(config => {
    const decrypted = AES.decrypt(
      config.data,
      MD5("diosfjckwpqpdfjkvnqQjsik").toString(enc.Utf8),
      {
        mode: mode.ECB,  // 使用 ECB 模式
      }
    )
    // 返回解密后的 JSON 数据
    config.data = JSON.parse(decrypted.toString(enc.Utf8))
    return config
  })
  return api
})
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
      forks() {
        const abort = new AbortController()
        const apiGetters = apiGetter
        let apis = new Array<string>()
        try {
          for (const api of apiGetters) {
            apiGetterAxios.get<{
              Setting: string[],
              Server: string[]
            }>(api, { signal: abort.signal }).then(res => {
              apis = res.Server
              abort.abort()
            })
          }
        } catch { }
        if (isEmpty(apis)) {
          throw new Error('[plugin jmcomic] not found any apis.')
        }
        return apis
      },
      test: (fork, signal) => testAxios.get(fork, { signal })
    }
  },
  image: {
    forks: {
      default: image
    },
    test: '/media/users/5128018.jpg',
    process: {
      comicDecode: jm.image.decoder
    }
  },
  onBooted: ins => {
    console.log('[plugin jmcomic] setup...', ins, ins.api?.api)
    if (ins.api?.api) {
      const f = ins.api.api
      const api = Utils.request.createAxios(() => f, {}, ins => {
        ins.interceptors.request.use(requestConfig => {
          const authorization = jmStore.loginToken
          const key = Date.now().toString()
          const token = MD5(`${key}185Hcomic3PAPP7R`).toString()
          const tokenParam = `${key},1.7.9`
          requestConfig.jm_key = key
          requestConfig.headers.set('Token', token)
          requestConfig.headers.set('Tokenparam', tokenParam)
          if (authorization) requestConfig.headers.set('Authorization', `Bearer ${authorization}`)
          const baseHeader = {
            Version: "v1.2.9",
            Cookie: `AVS=${jmStore.loginAvs || ''}`,
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
        jmStore.api = api
        // Utils.eventBus.SharedFunction.define(bika.api.search.getRandomComic, pluginName, 'getRandomProvide')
        return ins
      })
    }
  },
  auth: {
    passSelect: async () => {
      console.log(jmStore.loginData)
      return (jmStore.loginData.email !== '') ? 'logIn' : false
    },
    async logIn(by) {
      if (jmStore.loginData.email !== '') var form = jmStore.loginData
      else var form = jmStore.loginData = await by.form({
        email: {
          type: 'string',
          info: '用户名'
        },
        password: {
          type: 'string',
          info: '密码'
        }
      })
      const res = await bika.api.auth.login(form)
      console.log(res)
      jmStore.loginToken = res.token
    },
    async signUp(by) {
      const form = await by.form({
      })
      await bika.api.auth.signUp({
        ...form,
        birthday: dayjs(form.birthday).format('YYYY-MM-DD'),
        gender: <bika.user.Gender>form.gender
      })
    }
  },
})