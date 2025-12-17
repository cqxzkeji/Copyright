<template>
  <div class="grid grid-2" style="gap: 16px;">
    <div class="section-card">
      <div class="card-title">实时指标</div>
      <div class="grid grid-3">
        <div>
          <div class="card-subtitle">今日GMV</div>
          <div style="font-size: 26px; font-weight: 700;">¥{{ metrics.gmv.toLocaleString() }}</div>
          <p class="card-subtitle">较昨日 {{ metrics.gmvGrowth }}%</p>
        </div>
        <div>
          <div class="card-subtitle">支付转化</div>
          <div style="font-size: 26px; font-weight: 700;">{{ metrics.payRate }}%</div>
          <p class="card-subtitle">下单转化 {{ metrics.orderRate }}%</p>
        </div>
        <div>
          <div class="card-subtitle">售后完成</div>
          <div style="font-size: 26px; font-weight: 700;">{{ metrics.afterSale }}%</div>
          <p class="card-subtitle">客服满意度 {{ metrics.satisfaction }}%</p>
        </div>
      </div>
      <div style="margin-top: 12px;">
        <div class="card-subtitle">近7天交易额</div>
        <div class="grid" style="grid-template-columns: repeat(7, 1fr); gap: 10px; align-items: end;">
          <div v-for="(v, i) in metrics.last7Days" :key="i" style="text-align: center;">
            <div style="background: linear-gradient(180deg, #38bdf8, #c7d2fe); border-radius: 12px 12px 4px 4px; transition: height .3s;" :style="{ height: v / 300 + 'px' }"></div>
            <small class="card-subtitle">D{{ i + 1 }}</small>
          </div>
        </div>
      </div>
    </div>

    <div class="section-card">
      <div class="card-title">数据与设置</div>
      <div class="grid grid-2">
        <div class="field">
          <label>数据刷新周期（分钟）</label>
          <input v-model.number="setting.refresh" type="number" class="input" />
        </div>
        <div class="field">
          <label>告警邮箱</label>
          <input v-model="setting.email" class="input" />
        </div>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 12px; flex-wrap: wrap;">
        <button class="primary" @click="saveSetting">保存设置</button>
        <button class="ghost" @click="openSync">同步数据</button>
        <button class="ghost" @click="openClean">清理缓存</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>配置项</th>
            <th>当前值</th>
            <th>更新时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in configList" :key="item.key">
            <td>{{ item.key }}</td>
            <td>{{ item.value }}</td>
            <td>{{ item.time }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="section-card">
    <div class="card-title">渠道分布</div>
    <table class="table">
      <thead>
        <tr>
          <th>渠道</th>
          <th>订单数</th>
          <th>GMV</th>
          <th>转化率</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in channels" :key="row.name">
          <td>{{ row.name }}</td>
          <td>{{ row.orders }}</td>
          <td>¥{{ row.gmv.toLocaleString() }}</td>
          <td>{{ row.rate }}%</td>
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
      <div v-if="modalType === 'save'">
        <p>保存后将立即应用新的告警邮箱和刷新周期。</p>
      </div>
      <div v-else-if="modalType === 'sync'">
        <p>正在同步 BI 数据...</p>
        <div class="progress-bar"><span :style="{ width: progress + '%' }"></span></div>
      </div>
      <div v-else-if="modalType === 'clean'">
        <p>确认清除缓存并重新拉取配置？</p>
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

const metrics = reactive({
  gmv: 238000,
  gmvGrowth: 12,
  payRate: 42,
  orderRate: 68,
  afterSale: 96,
  satisfaction: 94,
  last7Days: [3200, 4500, 3800, 5100, 4700, 5600, 6200]
})

const channels = reactive([
  { name: '自营小程序', orders: 820, gmv: 92000, rate: 41 },
  { name: '抖音商城', orders: 610, gmv: 78000, rate: 38 },
  { name: '天猫旗舰店', orders: 430, gmv: 66000, rate: 35 },
  { name: '京东自营', orders: 380, gmv: 62000, rate: 33 },
  { name: '社区团购', orders: 510, gmv: 54000, rate: 26 },
  { name: '线下门店', orders: 420, gmv: 36000, rate: 18 },
  { name: '批发渠道', orders: 220, gmv: 28000, rate: 12 },
  { name: '社群分销', orders: 260, gmv: 30000, rate: 16 },
  { name: '校园团购', orders: 180, gmv: 15000, rate: 10 },
  { name: '跨境出口', orders: 120, gmv: 24000, rate: 8 }
])

const configList = reactive([
  { key: '价格同步', value: '实时', time: '09:10' },
  { key: '库存监测', value: '每5分钟', time: '09:11' },
  { key: '营销日历', value: '周度推送', time: '09:00' },
  { key: '客服升级', value: '自动分配', time: '08:55' },
  { key: '风控策略', value: '中等', time: '08:40' },
  { key: '发票校验', value: '自动校验', time: '08:30' },
  { key: '物流回传', value: '实时', time: '08:20' },
  { key: '供应商对账', value: '每日', time: '08:00' },
  { key: '评价监控', value: '关键字告警', time: '07:50' },
  { key: '缓存刷新', value: '每30分钟', time: '07:30' }
])

const setting = reactive({ refresh: 10, email: 'ops@agri.com' })
const modalType = ref('')
const progress = ref(0)
let timer

const modalTitle = computed(() => {
  switch (modalType.value) {
    case 'save':
      return '保存设置'
    case 'sync':
      return '同步数据'
    case 'clean':
      return '清理缓存'
    default:
      return ''
  }
})

const saveSetting = () => {
  modalType.value = 'save'
}

const openSync = () => {
  modalType.value = 'sync'
  progress.value = 0
  timer = setInterval(() => {
    progress.value = Math.min(progress.value + 25, 100)
    if (progress.value === 100) clearInterval(timer)
  }, 300)
}

const openClean = () => {
  modalType.value = 'clean'
}

const closeModal = () => {
  modalType.value = ''
  clearInterval(timer)
}

const confirm = () => {
  closeModal()
}
</script>
