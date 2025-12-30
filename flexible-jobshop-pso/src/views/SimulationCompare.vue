<template>
  <div class="section">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <h3>仿真评估与方案对比</h3>
      <div class="actions">
        <button class="primary-btn" @click="openSimulateHandler">启动仿真</button>
        <button class="secondary-btn" @click="openCompare">方案对比</button>
        <button class="secondary-btn" @click="openBottleneck">瓶颈分析</button>
      </div>
    </div>
    <p>离散事件仿真校验排程冲突、等待与瓶颈，输出多维指标。</p>

    <div class="section" style="margin-top:12px;">
      <h3>方案指标</h3>
      <table class="table">
        <thead>
          <tr><th>方案</th><th>Makespan</th><th>总延期</th><th>设备利用率</th><th>在制品峰值</th><th>换型次数</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in scenarios" :key="s.name">
            <td>{{ s.name }}</td>
            <td>{{ s.makespan }} h</td>
            <td>{{ s.delay }} h</td>
            <td>{{ s.util }}%</td>
            <td>{{ s.wip }}</td>
            <td>{{ s.changeover }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid" style="margin-top:16px;">
      <div class="metric-card">
        <h4>在制品曲线</h4>
        <div v-for="point in wipCurve" :key="point.time" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ point.time }}h</span><span>{{ point.value }}</span>
          </div>
          <div class="chart-bar" :style="{width: point.value * 4 + 'px', background:'linear-gradient(90deg,#4ade80,#16a34a)'}"></div>
        </div>
      </div>
      <div class="metric-card">
        <h4>设备负载热力</h4>
        <div v-for="m in heat" :key="m.name" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ m.name }}</span><span>{{ m.value }}%</span>
          </div>
          <div class="chart-bar" :style="{width: m.value + '%', background:'linear-gradient(90deg,#f472b6,#ec4899)'}"></div>
        </div>
      </div>
    </div>

    <BaseModal v-if="showSim" title="离散事件仿真" @close="showSim=false">
      <p>仿真中：检测设备冲突与等待，生成事件日志。</p>
      <div class="progress-bar" style="margin:12px 0;">
        <div class="fill" :style="{width: simProgress + '%'}"></div>
      </div>
      <ul>
        <li v-for="log in simLogs" :key="log">{{ log }}</li>
      </ul>
    </BaseModal>

    <BaseModal v-if="showCompare" title="方案对比" @close="showCompare=false">
      <p>对比不同权重与排程策略的效果。</p>
      <table class="table">
        <thead>
          <tr><th>指标</th><th>方案A</th><th>方案B</th><th>方案C</th></tr>
        </thead>
        <tbody>
          <tr v-for="row in compareRows" :key="row.metric">
            <td>{{ row.metric }}</td>
            <td>{{ row.a }}</td>
            <td>{{ row.b }}</td>
            <td>{{ row.c }}</td>
          </tr>
        </tbody>
      </table>
    </BaseModal>

    <BaseModal v-if="showBottleneck" title="瓶颈分析" @close="showBottleneck=false">
      <p>识别约束设备与工序等待，建议插单与加班策略。</p>
      <ul>
        <li v-for="b in bottlenecks" :key="b.machine">{{ b.machine }}：{{ b.reason }}</li>
      </ul>
      <button class="primary-btn" @click="relieve">生成缓解方案</button>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const scenarios = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    name: `方案-${idx + 1}`,
    makespan: 28 + idx * 0.3,
    delay: (idx % 3) * 1.5,
    util: 70 + (idx % 6) * 3,
    wip: 18 + (idx % 5),
    changeover: 9 + (idx % 4)
  }))
)

const wipCurve = ref([
  { time: 0, value: 4 },
  { time: 4, value: 7 },
  { time: 8, value: 9 },
  { time: 12, value: 12 },
  { time: 16, value: 10 },
  { time: 20, value: 6 },
  { time: 24, value: 5 }
])

const heat = ref([
  { name: 'M01', value: 84 },
  { name: 'M02', value: 68 },
  { name: 'M03', value: 75 },
  { name: 'M04', value: 57 }
])

const compareRows = ref([
  { metric: 'Makespan', a: '30h', b: '28h', c: '32h' },
  { metric: '总延期', a: '3h', b: '1h', c: '5h' },
  { metric: '设备利用率', a: '81%', b: '87%', c: '72%' },
  { metric: 'WIP峰值', a: '23', b: '20', c: '27' }
])

const bottlenecks = ref([
  { machine: 'M01', reason: '精铣工序集中导致排队' },
  { machine: 'M05', reason: '热处理时间长，缺少并行炉' }
])

const showSim = ref(false)
const showCompare = ref(false)
const showBottleneck = ref(false)
const simProgress = ref(0)
const simLogs = ref(['初始化事件列表', '锁定维护窗口'])

const openSimulate = () => (showSim.value = true)
const openCompare = () => (showCompare.value = true)
const openBottleneck = () => (showBottleneck.value = true)

const simulate = () => {
  simProgress.value = 0
  const timer = setInterval(() => {
    simProgress.value += 20
    simLogs.value.push(`进度 ${simProgress.value}%：校验冲突`)
    if (simProgress.value >= 100) {
      simLogs.value.push('仿真完成，生成指标报表')
      clearInterval(timer)
    }
  }, 260)
}

const openSimulateAndRun = () => {
  openSimulate()
  simulate()
}

const relieve = () => {
  bottlenecks.value.push({ machine: 'M02', reason: '建议加班+提前换型' })
}

// tie simulate to button
const openSimulateHandler = () => {
  openSimulateAndRun()
}
</script>
