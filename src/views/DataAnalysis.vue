<template>
  <div class="section-card">
    <div class="section-title">
      <h2>数据分析模块</h2>
      <span class="status-chip">自动刷新</span>
    </div>
    <div class="toolbar" style="margin: 10px 0">
      <button @click="showFilter = true">筛选报表</button>
      <button @click="showPreview = true">查看图表</button>
      <button @click="showExport = true">导出任务</button>
    </div>
    <div class="card-grid">
      <div class="chart-panel">
        <div class="section-title">
          <h3>渠道转化</h3>
          <span class="badge">周度</span>
        </div>
        <div class="chart-bars">
          <div
            v-for="row in conversions"
            :key="row.channel"
            class="chart-bar"
            :style="{ height: `${row.rate * 1.6}px` }"
          ></div>
        </div>
        <div class="flex-row" style="justify-content: space-between; margin-top: 8px; font-size: 12px; color: var(--muted);">
          <span v-for="row in conversions" :key="row.channel">{{ row.channel }}</span>
        </div>
      </div>
      <div class="table-card">
        <div class="section-title">
          <h3>指标表</h3>
          <span class="badge">10+行</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>日期</th>
              <th>活跃用户</th>
              <th>留存率</th>
              <th>工单数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in metrics" :key="row.date">
              <td>{{ row.date }}</td>
              <td>{{ row.active }}</td>
              <td>{{ row.retention }}%</td>
              <td>{{ row.tickets }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <ModalDialog :open="showFilter" title="筛选报表" :on-close="() => (showFilter = false)">
      <div class="label">日期范围</div>
      <input class="input-field" v-model="filters.range" placeholder="例：2024-04-01 ~ 2024-04-30" />
      <div class="label">维度</div>
      <input class="input-field" v-model="filters.dim" placeholder="渠道 / 城市 / 设备" />
      <div class="modal-actions">
        <button @click="applyFilter">应用筛选</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showPreview" title="图表预览" :on-close="() => (showPreview = false)">
      <p>已根据当前筛选条件生成预览。</p>
      <div class="progress-bar">
        <div class="progress-inner" :style="{ width: `${previewProgress}%` }"></div>
      </div>
      <div class="modal-actions">
        <button @click="previewProgress = Math.min(100, previewProgress + 25)">刷新渲染</button>
      </div>
    </ModalDialog>
    <ModalDialog :open="showExport" title="导出报表" :on-close="() => (showExport = false)">
      <p>确认以 CSV 发送到指定邮箱。</p>
      <input class="input-field" v-model="exportEmail" placeholder="请输入邮箱" />
      <div class="modal-actions">
        <button @click="confirmExport">发送</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const conversions = [
  { channel: '官网', rate: 62 },
  { channel: '社群', rate: 54 },
  { channel: '广告', rate: 71 },
  { channel: '搜索', rate: 66 },
  { channel: '线下', rate: 48 },
  { channel: '邮件', rate: 52 },
  { channel: '合作', rate: 60 }
]

const metrics = [
  { date: '05-01', active: 2050, retention: 38, tickets: 94 },
  { date: '05-02', active: 2142, retention: 40, tickets: 88 },
  { date: '05-03', active: 2190, retention: 42, tickets: 76 },
  { date: '05-04', active: 2310, retention: 44, tickets: 80 },
  { date: '05-05', active: 2266, retention: 43, tickets: 72 },
  { date: '05-06', active: 2378, retention: 45, tickets: 65 },
  { date: '05-07', active: 2420, retention: 46, tickets: 70 },
  { date: '05-08', active: 2510, retention: 48, tickets: 68 },
  { date: '05-09', active: 2598, retention: 49, tickets: 62 },
  { date: '05-10', active: 2640, retention: 50, tickets: 55 }
]

const filters = reactive({ range: '', dim: '' })
const showFilter = ref(false)
const showPreview = ref(false)
const showExport = ref(false)
const previewProgress = ref(40)
const exportEmail = ref('')

const applyFilter = () => {
  previewProgress.value = 60
  showPreview.value = true
  showFilter.value = false
}

const confirmExport = () => {
  showExport.value = false
  showPreview.value = true
  previewProgress.value = 100
}
</script>
