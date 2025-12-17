<template>
  <div class="section-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <div class="card-title">交易结算</div>
        <div class="card-subtitle">对账、结算与票据处理</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary" @click="openSettle">发起批量结算</button>
        <button class="ghost" @click="openInvoice">开票申请</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>流水号</th>
          <th>渠道</th>
          <th>金额</th>
          <th>手续费</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in settlements" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.channel }}</td>
          <td>¥{{ item.amount.toFixed(2) }}</td>
          <td>¥{{ item.fee.toFixed(2) }}</td>
          <td><span class="badge" :style="{ background: item.status === '待结算' ? '#f1f5f9' : '#dcfce7', color: item.status === '待结算' ? '#0f172a' : '#16a34a' }">{{ item.status }}</span></td>
          <td style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button class="ghost" @click="openDetail(item)">详情</button>
            <button class="ghost" @click="openManual(item)">手动对账</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="modalType" class="modal-overlay" role="dialog" aria-modal="true">
    <div class="modal">
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>
        <button class="ghost" @click="closeModal">✕</button>
      </div>
      <div v-if="modalType === 'settle'">
        <p>正在提交批量结算申请...</p>
        <div class="progress-bar"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <div v-else-if="modalType === 'invoice'">
        <div class="field">
          <label>开票抬头</label>
          <input v-model="invoice.title" class="input" />
        </div>
        <div class="field">
          <label>开票金额</label>
          <input v-model.number="invoice.amount" type="number" class="input" />
        </div>
      </div>
      <div v-else-if="modalType === 'detail'">
        <p>渠道：{{ current.channel }}</p>
        <p>金额：¥{{ current.amount.toFixed(2) }}</p>
        <p>手续费：¥{{ current.fee.toFixed(2) }}</p>
      </div>
      <div v-else-if="modalType === 'manual'">
        <p>为 {{ current.id }} 上传对账附件</p>
        <input class="input" placeholder="上传文件链接" v-model="current.attachment" />
      </div>
      <div class="modal-actions">
        <button class="ghost" @click="closeModal">关闭</button>
        <button class="primary" @click="confirmAction">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'

const settlements = reactive([
  { id: 'JS2406001', channel: '支付宝', amount: 12340, fee: 68, status: '待结算' },
  { id: 'JS2406002', channel: '微信', amount: 8540, fee: 45, status: '待结算' },
  { id: 'JS2406003', channel: '银行卡', amount: 4560, fee: 32, status: '已结算' },
  { id: 'JS2406004', channel: '微信', amount: 9200, fee: 54, status: '已结算' },
  { id: 'JS2406005', channel: '支付宝', amount: 13400, fee: 70, status: '待结算' },
  { id: 'JS2406006', channel: '银行卡', amount: 6400, fee: 36, status: '待结算' },
  { id: 'JS2406007', channel: '微信', amount: 7800, fee: 41, status: '已结算' },
  { id: 'JS2406008', channel: '支付宝', amount: 5100, fee: 26, status: '已结算' },
  { id: 'JS2406009', channel: '微信', amount: 4600, fee: 22, status: '待结算' },
  { id: 'JS2406010', channel: '银行卡', amount: 3120, fee: 18, status: '待结算' },
  { id: 'JS2406011', channel: '微信', amount: 8620, fee: 47, status: '待结算' }
])

const modalType = ref('')
const current = reactive({})
const invoice = reactive({ title: '四川农贸科技有限公司', amount: 10000 })
const progress = ref(0)
let timer

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'settle':
      return '批量结算'
    case 'invoice':
      return '开票申请'
    case 'detail':
      return '结算详情'
    case 'manual':
      return '手动对账'
    default:
      return ''
  }
})

const openSettle = () => {
  modalType.value = 'settle'
  progress.value = 0
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 15, 100)
    if (progress.value === 100) clearInterval(timer)
  }, 400)
}

const openInvoice = () => {
  modalType.value = 'invoice'
}

const openDetail = (row) => {
  Object.assign(current, row)
  modalType.value = 'detail'
}

const openManual = (row) => {
  Object.assign(current, row)
  modalType.value = 'manual'
}

const closeModal = () => {
  modalType.value = ''
  clearInterval(timer)
}

const confirmAction = () => {
  closeModal()
}

onMounted(() => () => clearInterval(timer))
</script>
