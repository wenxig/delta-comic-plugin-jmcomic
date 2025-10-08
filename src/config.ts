import { Store } from 'delta-comic-core'
import { pluginName } from './symbol'
export const config = (Store.useConfig().$useCustomConfig(pluginName, {
  
}))