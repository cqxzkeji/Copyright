<template>
  <section class="grid" style="gap: 18px">
    <div class="flex-between">
      <div>
        <p class="badge">实时分析</p>
        <h3 style="margin: 4px 0">用户行为数据分析</h3>
      </div>
      <div style="display: flex; gap: 8px">
        <button class="secondary-btn" @click="openFilter">添加过滤条件</button>
        <button class="primary-btn" @click="openAnalyze">开始分析</button>
        <button class="secondary-btn" @click="openExport">导出分析结果</button>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">活跃行为分布</h4>
        <span class="tag">更新于 {{ new Date().toLocaleTimeString() }}</span>
      </div>
      <div class="chart-bars">
        <div v-for="item in behaviorChart" :key="item.label" class="chart-bar">
          <div class="flex-between">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
          <div class="bar" :style="{ width: item.value + '%' }"></div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="flex-between" style="margin-bottom: 10px">
        <h4 style="margin: 0">关键事件表</h4>
        <span class="badge">近24小时</span>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>事件</th>
            <th>页面</th>
            <th>数量</th>
            <th>设备</th>
            <th>地区</th>
            <th>转化率</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in behaviorRows" :key="row.id">
            <td>{{ row.event }}</td>
            <td>{{ row.page }}</td>
            <td>{{ row.count }}</td>
            <td>{{ row.device }}</td>
            <td>{{ row.region }}</td>
            <td>{{ row.cv }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <ModalDialog
      v-if="showFilter"
      title="新增过滤条件"
      badge="配置"
      description="根据人群、渠道或终端过滤行为数据"
      @close="showFilter = false"
    >
      <div class="form-row two-col">
        <div>
          <label class="label">渠道</label>
          <select v-model="filter.channel">
            <option>全部</option>
            <option>自然流量</option>
            <option>广告投放</option>
            <option>社交媒体</option>
          </select>
        </div>
        <div>
          <label class="label">终端</label>
          <select v-model="filter.device">
            <option>全部</option>
            <option>移动端</option>
            <option>桌面端</option>
          </select>
        </div>
        <div>
          <label class="label">地区</label>
          <input v-model="filter.region" placeholder="例如：华东" />
        </div>
        <div>
          <label class="label">转化率下限</label>
          <input type="number" v-model.number="filter.cv" min="0" max="100" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showFilter = false">取消</button>
        <button class="primary-btn" @click="applyFilter">保存过滤</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showAnalyze"
      title="运行分析任务"
      badge="任务"
      description="将基于当前过滤条件对事件与路径进行归因分析"
      @close="resetAnalyze"
    >
      <div class="progress-bar" style="margin: 12px 0">
        <span :style="{ width: progress + '%' }"></span>
      </div>
      <p style="margin: 0">{{ progress < 100 ? '正在聚合…' : '分析完成' }}</p>
      <div style="display: flex; justify-content: flex-end; margin-top: 14px">
        <button class="primary-btn" @click="resetAnalyze">关闭</button>
      </div>
    </ModalDialog>

    <ModalDialog
      v-if="showExport"
      title="导出分析报告"
      badge="导出"
      description="选择导出格式并推送到指定邮箱"
      @close="showExport = false"
    >
      <div class="form-row">
        <div>
          <label class="label">格式</label>
          <select v-model="exportForm.format">
            <option>PDF</option>
            <option>CSV</option>
            <option>Excel</option>
          </select>
        </div>
        <div>
          <label class="label">接收邮箱</label>
          <input type="email" v-model="exportForm.email" placeholder="data@company.com" />
        </div>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px">
        <button class="secondary-btn" @click="showExport = false">取消</button>
        <button class="primary-btn" @click="submitExport">发送</button>
      </div>
    </ModalDialog>
  </section>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const behaviorChart = [
  { label: '首页浏览', value: 82 },
  { label: '搜索查询', value: 64 },
  { label: '商品点击', value: 73 },
  { label: '加购', value: 51 },
  { label: '提交订单', value: 34 },
  { label: '支付完成', value: 27 }
]

const behaviorRows = [
  { id: 1, event: '页面停留>60s', page: '商品详情', count: 1280, device: '移动端', region: '华东', cv: 18 },
  { id: 2, event: '加入购物车', page: '商品详情', count: 890, device: '移动端', region: '华南', cv: 23 },
  { id: 3, event: '跳出', page: '首页', count: 420, device: '桌面端', region: '华北', cv: 3 },
  { id: 4, event: '搜索', page: '站内搜索', count: 2080, device: '移动端', region: '西南', cv: 11 },
  { id: 5, event: '收藏', page: '商品详情', count: 510, device: '桌面端', region: '华中', cv: 12 },
  { id: 6, event: '登录', page: '登录页', count: 760, device: '移动端', region: '东北', cv: 42 },
  { id: 7, event: '分享', page: '商品详情', count: 330, device: '移动端', region: '华东', cv: 8 },
  { id: 8, event: '下单', page: '结算页', count: 280, device: '桌面端', region: '华北', cv: 76 },
  { id: 9, event: '支付', page: '支付页', count: 210, device: '移动端', region: '华南', cv: 92 },
  { id: 10, event: '退款申请', page: '订单详情', count: 35, device: '桌面端', region: '西北', cv: 4 }
]

const showFilter = ref(false)
const showAnalyze = ref(false)
const showExport = ref(false)
const progress = ref(18)
const filter = reactive({ channel: '全部', device: '全部', region: '', cv: 0 })
const exportForm = reactive({ format: 'PDF', email: '' })
let timer

const openFilter = () => (showFilter.value = true)
const openAnalyze = () => {
  showAnalyze.value = true
  progress.value = 18
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 14)
    if (progress.value === 100) clearInterval(timer)
  }, 500)
}

const openExport = () => (showExport.value = true)

const applyFilter = () => {
  showFilter.value = false
}

const resetAnalyze = () => {
  showAnalyze.value = false
  clearInterval(timer)
}

const submitExport = () => {
  showExport.value = false
}

onMounted(() => {})
</script>
