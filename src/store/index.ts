import type { jm } from "@/api"
import type { Utils } from "delta-comic-core"
import { useLocalStorage } from '@vueuse/core'
export namespace jmStore {
  export let api: Utils.request.Requester
  export let loginToken: string | undefined
  export let loginAvs: string | undefined
  export const loginData = useLocalStorage('jm.auth.LoginData')
}