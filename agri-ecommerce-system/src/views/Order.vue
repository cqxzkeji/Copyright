<template>
  <div class="section-card">
    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
      <div>
        <div class="card-title">订单管理</div>
        <div class="card-subtitle">履约、物流与售后状态跟踪</div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button class="primary" @click="openDispatch">批量发货</button>
        <button class="ghost" @click="openExport">导出订单</button>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>客户</th>
          <th>金额</th>
          <th>状态</th>
          <th>物流</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>{{ order.id }}</td>
          <td>{{ order.customer }}</td>
          <td>¥{{ order.amount.toFixed(2) }}</td>
          <td>{{ order.status }}</td>
          <td>{{ order.logistics }}</td>
          <td style="display: flex; gap: 6px; flex-wrap: wrap;">
            <button class="ghost" @click="openShip(order)">发货</button>
            <button class="ghost" @click="openRefund(order)">退款</button>
            <button class="ghost" @click="openTrace(order)">跟踪</button>
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
      <div v-if="modalType === 'ship'">
        <p>为订单 {{ current.id }} 填写物流信息</p>
        <input class="input" v-model="current.logistics" placeholder="快递公司 + 单号" />
      </div>
      <div v-else-if="modalType === 'refund'">
        <p>退款原因</p>
        <textarea class="input" rows="3" v-model="current.reason"></textarea>
      </div>
      <div v-else-if="modalType === 'trace'">
        <p>物流轨迹刷新中...</p>
        <div class="progress-bar"><span :style="{ width: traceProgress + '%' }"></span></div>
      </div>
      <div v-else-if="modalType === 'dispatch'">
        <p>批量发货将创建 {{ orders.length }} 个揽收单，确认继续？</p>
      </div>
      <div v-else-if="modalType === 'export'">
        <p>导出近7日订单为 CSV，文件将通过邮箱发送。</p>
      </div>
      <div class="modal-actions">
        <button class="ghost" @click="closeModal">取消</button>
        <button class="primary" @click="confirm">确认</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'

const orders = reactive([
  { id: 'SO24061001', customer: '李欣', amount: 320, status: '待发货', logistics: '未分配' },
  { id: 'SO24061002', customer: '张腾', amount: 188, status: '运输中', logistics: '京东 8899234' },
  { id: 'SO24061003', customer: '赵园', amount: 560, status: '已签收', logistics: '顺丰 4401290' },
  { id: 'SO24061004', customer: '吴明', amount: 96, status: '待发货', logistics: '未分配' },
  { id: 'SO24061005', customer: '刘思', amount: 260, status: '已签收', logistics: '申通 2201930' },
  { id: 'SO24061006', customer: '蒋立', amount: 420, status: '运输中', logistics: '韵达 9911233' },
  { id: 'SO24061007', customer: '陈宇', amount: 150, status: '待发货', logistics: '未分配' },
  { id: 'SO24061008', customer: '黄依', amount: 380, status: '待发货', logistics: '未分配' },
  { id: 'SO24061009', customer: '谢博', amount: 265, status: '运输中', logistics: '中通 9900123' },
  { id: 'SO24061010', customer: '唐倩', amount: 144, status: '已签收', logistics: '圆通 8823477' },
  { id: 'SO24061011', customer: '李云', amount: 332, status: '已签收', logistics: '顺丰 8822200' }
])

const modalType = ref('')
const current = reactive({})
const traceProgress = ref(0)
let timer

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'ship':
      return '填写发货信息'
    case 'refund':
      return '退款处理'
    case 'trace':
      return '物流跟踪'
    case 'dispatch':
      return '批量发货'
    case 'export':
      return '导出订单'
    default:
      return ''
  }
})

const openShip = (row) => {
  Object.assign(current, row)
  modalType.value = 'ship'
}

const openRefund = (row) => {
  Object.assign(current, row, { reason: '' })
  modalType.value = 'refund'
}

const openTrace = (row) => {
  Object.assign(current, row)
  traceProgress.value = 10
  modalType.value = 'trace'
  timer = setInterval(() => {
    traceProgress.value = Math.min(traceProgress.value + 20, 100)
    if (traceProgress.value === 100) clearInterval(timer)
  }, 400)
}

const openDispatch = () => {
  modalType.value = 'dispatch'
}

const openExport = () => {
  modalType.value = 'export'
}

const closeModal = () => {
  modalType.value = ''
  clearInterval(timer)
}

const confirm = () => {
  if (modalType.value === 'ship') {
    current.status = '运输中'
  }
  closeModal()
}
</script>
