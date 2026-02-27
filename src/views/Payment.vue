<template>
  <ModulePanel
    v-model="rows"
    :columns="columns"
    :chart-title="'跨境支付结算表现'"
    :chart-data="chartData"
    :image="image"
    :form-fields="formFields"
    :progress="progress"
    :notice-text="'支付模块用于多币种结算、风控监测和异常处理。'"
  />
</template>

<script setup>
import { ref } from 'vue'
import ModulePanel from '../components/ModulePanel.vue'
import image from '../assets/payment.svg'
import { generateRows } from './moduleData'

const columns = [
  { key: 'orderNo', label: '结算单号' },
  { key: 'currency', label: '币种' },
  { key: 'amount', label: '金额' },
  { key: 'risk', label: '风险等级' }
]
const formFields = columns
const rows = ref(generateRows('支付', (i) => ({
  orderNo: `PAY-${Date.now().toString().slice(-4)}-${i}`,
  currency: ['USD', 'EUR', 'JPY', 'CNY'][i % 4],
  amount: `${(3000 + i * 137).toFixed(2)}`,
  risk: ['低', '中', '高'][i % 3]
})))
const chartData = [
  { label: '成功结算率', value: 91 },
  { label: '到账时效', value: 79 },
  { label: '风险拦截', value: 67 }
]
const progress = [
  { label: '支付发起', value: 92 },
  { label: '银行清算', value: 70 },
  { label: '到账确认', value: 60 }
]
</script>
