<script setup>
import { reactive, ref } from 'vue'

const setting = reactive({
  farmManager: '张场长',
  threshold: 45,
  notify: true,
  cycle: '每周'
})

const saveOpen = ref(false)
const tipOpen = ref(false)

const save = () => {
  saveOpen.value = true
}
</script>

<template>
  <a-card title="系统设置" :bordered="false">
    <a-form layout="vertical">
      <a-row :gutter="12">
        <a-col :xs="24" :md="12"><a-form-item label="负责人"><a-input v-model:value="setting.farmManager" /></a-form-item></a-col>
        <a-col :xs="24" :md="12"><a-form-item label="库存预警阈值"><a-input-number v-model:value="setting.threshold" style="width:100%" /></a-form-item></a-col>
      </a-row>
      <a-row :gutter="12">
        <a-col :xs="24" :md="12"><a-form-item label="报告周期"><a-select v-model:value="setting.cycle" :options="[{value:'每日'},{value:'每周'},{value:'每月'}]" /></a-form-item></a-col>
        <a-col :xs="24" :md="12"><a-form-item label="通知开关"><a-switch v-model:checked="setting.notify" /></a-form-item></a-col>
      </a-row>
      <a-space>
        <a-button type="primary" @click="save">保存设置</a-button>
        <a-button @click="tipOpen = true">功能提示</a-button>
      </a-space>
    </a-form>

    <a-modal v-model:open="saveOpen" title="保存结果" centered>
      <p>系统设置已保存，新的库存预警阈值将在下一轮计算生效。</p>
    </a-modal>

    <a-modal v-model:open="tipOpen" title="按钮提示信息" :footer="null" centered>
      <p>系统设置用于调整全局参数，保障推荐、核算和库存模块协同运行。</p>
      <a-button type="primary" block @click="tipOpen = false">确认</a-button>
    </a-modal>
  </a-card>
</template>
