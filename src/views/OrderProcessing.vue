<template>
  <div>
    <div class="header">
      <div>
        <h2>订单处理</h2>
        <p class="muted">从报价、排产到发运的全链路管理，确保履约可靠。</p>
      </div>
      <div class="action-row">
        <button class="primary-btn" @click="openContract">生成合同</button>
        <button class="secondary-btn" @click="openSchedule">排产确认</button>
      </div>
    </div>

    <div class="card-grid">
      <div class="card" v-for="item in kpis" :key="item.title">
        <div class="tag">{{ item.title }}</div>
        <h3>{{ item.value }}</h3>
        <p class="muted">{{ item.note }}</p>
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>订单号</th>
          <th>钢号</th>
          <th>数量</th>
          <th>交期</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.no">
          <td>{{ order.no }}</td>
          <td>{{ order.grade }}</td>
          <td>{{ order.qty }}</td>
          <td>{{ order.due }}</td>
          <td><span :class="['badge', order.status === '在产' ? 'badge-blue' : 'badge-green']">{{ order.status }}</span></td>
          <td>
            <button class="secondary-btn" @click="openInfo(order)">详情</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="showContract" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>生成合同</h3>
        <button class="secondary-btn" @click="showContract = false">关闭</button>
      </div>
      <p>将根据最新技术标准与价格策略生成合同草稿。</p>
      <div class="modal-footer">
        <button class="primary-btn" @click="confirmContract">生成</button>
      </div>
    </div>
  </div>

  <div v-if="showSchedule" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>排产确认</h3>
        <button class="secondary-btn" @click="showSchedule = false">关闭</button>
      </div>
      <p>已为本周新增订单预留轧机时段。</p>
      <div class="progress-bar"><div class="progress-fill" :style="{ width: 76 + '%' }"></div></div>
    </div>
  </div>

  <div v-if="showInfo" class="modal-mask">
    <div class="modal-container">
      <div class="modal-header">
        <h3>订单 {{ activeOrder.no }}</h3>
        <button class="secondary-btn" @click="showInfo = false">关闭</button>
      </div>
      <p>钢号：{{ activeOrder.grade }}，数量：{{ activeOrder.qty }}，交期：{{ activeOrder.due }}</p>
      <div class="alert">当前状态：{{ activeOrder.status }}，按钮提示：已触发更新节点。</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showContract = ref(false)
const showSchedule = ref(false)
const showInfo = ref(false)
const activeOrder = ref({})

const kpis = [
  { title: '本月签约', value: '8200 吨', note: '合同总额 1.1 亿元' },
  { title: '在产订单', value: '12 单', note: '全部锁定产线' },
  { title: '发运完成', value: '6 单', note: '准时率 96%' },
  { title: '异常预警', value: '2 单', note: '已安排协调' }
]

const orders = [
  { no: 'SO240601', grade: 'UTG-12CrMo', qty: '1200 吨', due: '6/28', status: '在产' },
  { no: 'SO240602', grade: 'UTG-5CrNiMo', qty: '800 吨', due: '7/02', status: '在产' },
  { no: 'SO240603', grade: 'UTG-30Cr2Ni4', qty: '1500 吨', due: '7/10', status: '在产' },
  { no: 'SO240604', grade: 'UTG-15CrMo', qty: '900 吨', due: '6/25', status: '准备发运' },
  { no: 'SO240605', grade: 'UTG-40Cr', qty: '700 吨', due: '7/18', status: '在产' },
  { no: 'SO240606', grade: 'UTG-9SiCr', qty: '500 吨', due: '6/30', status: '在产' },
  { no: 'SO240607', grade: 'UTG-20MnNi', qty: '1000 吨', due: '7/05', status: '准备发运' },
  { no: 'SO240608', grade: 'UTG-12CrNi3', qty: '650 吨', due: '7/12', status: '在产' },
  { no: 'SO240609', grade: 'UTG-50Mn2', qty: '1100 吨', due: '7/22', status: '在产' },
  { no: 'SO240610', grade: 'UTG-30CrMnSi', qty: '900 吨', due: '7/30', status: '在产' }
]

const openContract = () => (showContract.value = true)
const openSchedule = () => (showSchedule.value = true)
const openInfo = (order) => {
  activeOrder.value = order
  showInfo.value = true
}
const confirmContract = () => {
  showContract.value = false
  alert('合同草稿已生成并发送客户确认。')
}
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

h2 {
  margin: 0;
  color: #1e3a8a;
}

.muted {
  color: #6b7280;
  margin: 4px 0 0;
}

.action-row {
  display: flex;
  gap: 10px;
}
</style>
