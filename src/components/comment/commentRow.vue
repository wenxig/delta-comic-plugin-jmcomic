<script setup lang='ts'>
import { computed } from 'vue'
import { coreModule, requireDepend, uni } from 'delta-comic-core'
import { jm } from '@/api'
const $props = defineProps<{
  comment: jm.comment.Comment
  item: any
  parentComment?: uni.comment.Comment
}>()
const raw = computed(() => $props.comment.sender.customUser)
const $emit = defineEmits<{
  click: [c: uni.comment.Comment]
  clickUser: [u: uni.user.User]
}>()
defineSlots<{
  default(): void
}>()

const { comp } = requireDepend(coreModule)
</script>

<template>
  <comp.CommentRow :comment :parentComment>
    <template #userExtra>
      <span class="mr-1 text-[11px] text-(--nui-primary-color) font-normal">
        Lv{{ raw.expInfo.level }}
      </span>
    </template>
  </comp.CommentRow>
</template>