<template>
  <div class="section">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <h3>可视化看板与报表导出</h3>
      <div class="actions">
        <button class="primary-btn" @click="openExport">导出报表</button>
        <button class="secondary-btn" @click="openWarning">预警列表</button>
        <button class="secondary-btn" @click="openKanban">甘特图快照</button>
      </div>
    </div>
    <p>甘特、负载热力、WIP曲线、瓶颈分析，支持排程单/派工单导出。</p>

    <div class="card-grid">
      <div class="metric-card">
        <h4>设备负载热力图</h4>
        <div v-for="heat in loadHeat" :key="heat.name" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ heat.name }}</span><span>{{ heat.value }}%</span>
          </div>
          <div class="chart-bar" :style="{width: heat.value + '%', background:'linear-gradient(90deg,#60a5fa,#2563eb)'}"></div>
        </div>
      </div>
      <div class="metric-card">
        <h4>在制品趋势</h4>
        <div v-for="p in wip" :key="p.phase" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ p.phase }}</span><span>{{ p.value }}</span>
          </div>
          <div class="chart-bar" :style="{width: p.value * 6 + 'px', background:'linear-gradient(90deg,#c084fc,#a855f7)'}"></div>
        </div>
      </div>
      <div class="metric-card">
        <h4>瓶颈设备</h4>
        <ul>
          <li v-for="b in bottlenecks" :key="b.name">{{ b.name }}：{{ b.reason }}</li>
        </ul>
      </div>
    </div>

    <div class="section" style="margin-top:12px;">
      <h3>预警</h3>
      <table class="table">
        <thead>
          <tr><th>类型</th><th>内容</th><th>严重度</th></tr>
        </thead>
        <tbody>
          <tr v-for="w in warnings" :key="w.type">
            <td>{{ w.type }}</td>
            <td>{{ w.msg }}</td>
            <td><span class="badge" :class="w.level === '高' ? 'danger' : 'warn'">{{ w.level }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-if="showExport" title="报表导出" @close="showExport=false">
      <p>导出排程单 / 工序派工单 / 设备计划。</p>
      <div class="form">
        <label>格式<select v-model="exportForm.format">
          <option>Excel</option>
          <option>CSV</option>
          <option>PDF</option>
        </select></label>
        <label>范围<select v-model="exportForm.range">
          <option>本周</option>
          <option>本月</option>
          <option>本季度</option>
        </select></label>
        <button class="primary-btn" @click="simulateExport">开始导出</button>
      </div>
      <div class="progress-bar" style="margin-top:12px;" v-if="exporting">
        <div class="fill" :style="{width: exportProgress + '%'}"></div>
      </div>
    </BaseModal>

    <BaseModal v-if="showWarning" title="预警详情" @close="showWarning=false">
      <ul>
        <li v-for="w in warnings" :key="w.msg">{{ w.type }}：{{ w.msg }}</li>
      </ul>
    </BaseModal>

    <BaseModal v-if="showKanban" title="甘特图快照" @close="showKanban=false">
      <p>展示关键工件甘特片段，支持导出PNG。</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;">
        <div v-for="block in gantt" :key="block.job" style="padding:8px;border-radius:8px;background:#eef2ff;">
          <strong>{{ block.job }}</strong>
          <div class="chart-bar" :style="{width: block.length * 10 + 'px', background:'linear-gradient(90deg,#22d3ee,#2dd4bf)'}"></div>
          <small>{{ block.machine }} | {{ block.window }}</small>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const loadHeat = ref([
  { name: 'M01', value: 86 },
  { name: 'M02', value: 72 },
  { name: 'M03', value: 64 },
  { name: 'M04', value: 58 }
])

const wip = ref([
  { phase: 'Day1', value: 8 },
  { phase: 'Day2', value: 12 },
  { phase: 'Day3', value: 15 },
  { phase: 'Day4', value: 11 },
  { phase: 'Day5', value: 9 }
])

const bottlenecks = ref([
  { name: 'M03', reason: '热处理瓶颈，需平衡到M05' },
  { name: 'M07', reason: '换型时间长，建议合批' }
])

const warnings = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    type: ['交期', '负载', '维护'][idx % 3],
    msg: `工单 SO-${1000 + idx} 预计延期 ${(idx % 4) + 1} 小时`,
    level: idx % 2 === 0 ? '高' : '中'
  }))
)

const gantt = ref([
  { job: 'P-A1', machine: 'M01', window: '08:00-10:00', length: 12 },
  { job: 'P-B3', machine: 'M02', window: '09:00-11:00', length: 10 },
  { job: 'P-C2', machine: 'M04', window: '10:00-12:30', length: 14 },
  { job: 'P-D4', machine: 'M03', window: '11:00-13:00', length: 11 }
])

const showExport = ref(false)
const showWarning = ref(false)
const showKanban = ref(false)
const exporting = ref(false)
const exportProgress = ref(0)

const exportForm = reactive({ format: 'Excel', range: '本周' })

const openExport = () => (showExport.value = true)
const openWarning = () => (showWarning.value = true)
const openKanban = () => (showKanban.value = true)

const simulateExport = () => {
  exporting.value = true
  exportProgress.value = 0
  const timer = setInterval(() => {
    exportProgress.value += 20
    if (exportProgress.value >= 100) {
      exportProgress.value = 100
      exporting.value = false
      clearInterval(timer)
    }
  }, 260)
}
</script>
