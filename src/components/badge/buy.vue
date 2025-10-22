<script setup lang='ts'>
import { jm } from '@/api'
import { Comp, Store } from 'delta-comic-core'
const temp = Store.useTemp().$apply('jm:badge', () => ({
  badges: jm.api.user.badge.getAll()
}))
</script>

<template>
  <Comp.Content :source="temp.badges" v-slot="{ data }">
    {{ data }}
  </Comp.Content>
</template>