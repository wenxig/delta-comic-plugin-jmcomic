<script setup lang='ts'>
import { jmStore } from '@/store'
import { NDatePicker, NForm, NFormItem, NInput, NRadio, NRadioGroup } from 'naive-ui'
import { computed } from 'vue'
</script>

<template>
  <NForm :model="jmStore.useredit.value" label-placement="top" v-if="jmStore.useredit.value">
    <NDivider title-placement="left">
      个人信息
    </NDivider>
    <NFormItem label="昵称" path="nickName">
      <NInput v-model:value="jmStore.useredit.value.nickName" />
    </NFormItem>
    <div class="flex gap-3 w-full">
      <NFormItem label="姓" path="firstName">
        <NInput v-model:value="jmStore.useredit.value.firstName" />
      </NFormItem>
      <NFormItem label="名" path="lastName">
        <NInput v-model:value="jmStore.useredit.value.lastName" />
      </NFormItem>
    </div>
    <NFormItem label="生日" path="nickName">
      <NDatePicker type="date" value-format="yyyy-MM-DD" clearable
        v-model:formatted-value="jmStore.useredit.value.birthday" />
    </NFormItem>
    <NFormItem label="结婚状态" path="relations">
      <NRadioGroup v-model:value="jmStore.useredit.value.relations">
        <NRadio label="hideuswa" value="" />
        <NRadio label="单身" value="Single" />
        <NRadio label="非单身" value="Taken" />
        <NRadio label="<开放>" value="Open" />
      </NRadioGroup>
    </NFormItem>
    <NFormItem label="性取向" path="sexuality">
      <NRadioGroup v-model:value="jmStore.useredit.value.sexuality">
        <NRadio label="hideuswa" value="" />
        <NRadio label="男" value="Guys" />
        <NRadio label="女" value="Girls" />
        <NRadio label="双性恋" value="Guys + Girls" />
      </NRadioGroup>
    </NFormItem>
    <NFormItem label="个人主页" path="website">
      <NInput v-model:value="jmStore.useredit.value.website" />
    </NFormItem>
  </NForm>
</template>