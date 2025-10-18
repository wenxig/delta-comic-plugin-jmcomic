<script setup lang='ts'>
import { jm } from '@/api'
import { JmBlogPage } from '@/api/page'
import { NScrollbar } from 'naive-ui'
import { computed } from 'vue'

const $props = defineProps<{
  page: JmBlogPage
}>()
const union = computed(() => <jm.blog.JmBlog>$props.page.union.value)
const raw = computed(() => union.value.$$meta.raw)
</script>

<template>
  <NScrollbar class="!h-[100vh] w-full">
    <div v-html="raw.content"></div>
  </NScrollbar>
</template>