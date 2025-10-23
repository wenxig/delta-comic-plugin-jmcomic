<script setup lang='ts'>
import { jm } from '@/api'
import { pluginName } from '@/symbol'
import { CheckCircleOutlineOutlined } from '@vicons/material'
import { Comp, Store, uni } from 'delta-comic-core'
const temp = Store.useTemp().$apply('jm:badge', () => ({
  badges: jm.api.user.badge.getAll()
}))
</script>

<template>
  <Comp.Waterfall :col="1" :source="{ data: temp.badges, isEnd: true, }" :data-processor="v => v.toReversed()"
    v-slot="{ item }" class="!size-full">
    <button class="w-full bg-(--van-background-2) relative rounded-lg flex h-20 items-center overflow-hidden" :class="[
      item.done || 'van-haptics-feedback',
      item.done && 'after:bg-(--p-color)/10 opacity-80 after:absolute after:top-0 after:left-0 after:size-full'
    ]">
      <div class="text-nowrap absolute font-bold text-lg text-(--p-color) bottom-1 right-1" v-if="item.done">已购买</div>
      <NIcon color="var(--p-color)" size="130px" v-if="item.done"
        class="text-nowrap !absolute font-bold text-lg opacity-30 text-(--p-color) bottom-0 right-0 translate-x-1/3 translate-y-1/3">
        <CheckCircleOutlineOutlined />
      </NIcon>
      <div class="h-[calc(100%-10px)] pl-2">
        <Comp.Image :src="uni.image.Image.create({
          $$plugin: pluginName,
          forkNamespace: 'default',
          path: item.content
        }, { width: 1, height: 1 })" class="!size-full" />
      </div>
      <div class="h-full pl-1 py-1 flex flex-col relative">
        <div class="text-[16px]">{{ item.name }}</div>
        <div class="flex items-center absolute bottom-0 flex-nowrap text-nowrap">
          <NIcon>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="9"></circle>
                <path d="M14.8 9A2 2 0 0 0 13 8h-2a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4h-2a2 2 0 0 1-1.8-1"></path>
                <path d="M12 6v2m0 8v2"></path>
              </g>
            </svg>
          </NIcon>
          coin:
          <span class="text-(--p-color)">{{ item.coin }}</span>
        </div>
      </div>
    </button>
  </Comp.Waterfall>
</template>