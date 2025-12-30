<template>
  <div class="section">
    <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
      <h3>订单 / 工艺数据管理</h3>
      <div class="actions">
        <button class="primary-btn" @click="openImport">导入工单</button>
        <button class="secondary-btn" @click="openProcessEdit">新建工艺路线</button>
        <button class="secondary-btn" @click="openDispatch">生成派工单</button>
      </div>
    </div>
    <p>维护工件、工序、可选设备、加工时间与交期优先级，支持导入导出。</p>

    <div class="section" style="margin-top:12px;">
      <h3>订单清单（{{ orders.length }}条）</h3>
      <table class="table">
        <thead>
          <tr>
            <th>订单</th>
            <th>工件</th>
            <th>工序数</th>
            <th>可选设备</th>
            <th>加工时间(min)</th>
            <th>交期</th>
            <th>优先级</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in orders" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.part }}</td>
            <td>{{ item.steps }}</td>
            <td>{{ item.machines.join(', ') }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.due }}</td>
            <td><span class="badge" :class="priorityClass(item.priority)">{{ item.priority }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid" style="margin-top:16px;">
      <div class="metric-card">
        <h4>工序时间分布</h4>
        <div v-for="step in routeSamples" :key="step.name" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ step.name }}</span><span>{{ step.duration }} min</span>
          </div>
          <div class="chart-bar" :style="{width: step.duration + '%'}"></div>
        </div>
      </div>
      <div class="metric-card">
        <h4>设备负载</h4>
        <div v-for="machine in machineLoad" :key="machine.name" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ machine.name }}</span><span>{{ machine.load }}%</span>
          </div>
          <div class="chart-bar" :style="{width: machine.load + '%', background:'linear-gradient(90deg,#22d3ee,#6366f1)'}"></div>
        </div>
      </div>
    </div>

    <BaseModal v-if="showImport" title="导入订单数据" @close="showImport=false">
      <form class="form" @submit.prevent="confirmImport">
        <label>文件名称<input v-model="importForm.file" required placeholder="orders.xlsx" /></label>
        <label>字段映射<input v-model="importForm.map" required placeholder="订单号,工件,工序,设备,时间" /></label>
        <button class="primary-btn" type="submit">校验并导入</button>
      </form>
    </BaseModal>

    <BaseModal v-if="showProcess" title="工艺路线维护" @close="showProcess=false">
      <form class="form" @submit.prevent="saveProcess">
        <label>工件编码<input v-model="processForm.part" required /></label>
        <label>工序串<input v-model="processForm.route" required placeholder="OP10-OP20-OP30" /></label>
        <label>可选设备<input v-model="processForm.options" required placeholder="M01/M02" /></label>
        <div class="actions">
          <button class="primary-btn" type="submit">保存</button>
          <button class="secondary-btn" type="button" @click="addSampleRoute">添加示例</button>
        </div>
      </form>
    </BaseModal>

    <BaseModal v-if="showDispatch" title="派工单生成" @close="showDispatch=false">
      <p>基于交期和优先级生成派工单，同时校验工艺路线完整性。</p>
      <div class="progress-bar" style="margin:12px 0;">
        <div class="fill" :style="{width: progress + '%'}"></div>
      </div>
      <div style="display:flex;gap:8px;align-items:center;">
        <button class="primary-btn" @click="startDispatch">开始生成</button>
        <span>{{ progress }}% 完成</span>
      </div>
      <ul>
        <li v-for="log in dispatchLog" :key="log" style="color:#475569;">{{ log }}</li>
      </ul>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const orders = ref(
  Array.from({ length: 22 }).map((_, idx) => ({
    id: `SO-${(1000 + idx).toString()}`,
    part: `P-${String.fromCharCode(65 + (idx % 6))}${idx}`,
    steps: 3 + (idx % 4),
    machines: [`M0${(idx % 5) + 1}`, `M0${((idx + 1) % 5) + 1}`],
    time: 60 + (idx * 3) % 45,
    due: `D${idx % 5 + 1}/T${(idx % 3) + 1}`,
    priority: ['高', '中', '低'][idx % 3]
  }))
)

const routeSamples = ref([
  { name: 'OP10 粗加工', duration: 40 },
  { name: 'OP20 钻孔', duration: 55 },
  { name: 'OP30 热处理', duration: 35 },
  { name: 'OP40 精铣', duration: 60 }
])

const machineLoad = ref([
  { name: 'M01', load: 82 },
  { name: 'M02', load: 65 },
  { name: 'M03', load: 71 },
  { name: 'M04', load: 54 }
])

const showImport = ref(false)
const showProcess = ref(false)
const showDispatch = ref(false)
const importForm = reactive({ file: 'orders.xlsx', map: 'SO,Part,OP,Machine,Time' })
const processForm = reactive({ part: 'P-A1', route: 'OP10-OP20-OP30', options: 'M01/M02' })
const progress = ref(18)
const dispatchLog = ref(['校验交期优先级', '匹配工艺路线'])

const priorityClass = (p) => (p === '高' ? 'danger' : p === '中' ? 'warn' : 'success')
const openImport = () => (showImport.value = true)
const openProcessEdit = () => (showProcess.value = true)
const openDispatch = () => (showDispatch.value = true)

const confirmImport = () => {
  dispatchLog.value.push(`导入文件 ${importForm.file}`)
  showImport.value = false
}

const saveProcess = () => {
  routeSamples.value.push({ name: processForm.route, duration: 30 + Math.floor(Math.random() * 30) })
  showProcess.value = false
}

const addSampleRoute = () => {
  processForm.route = 'OP10-OP15-OP20-OP30'
  processForm.options = 'M02/M03/M05'
}

const startDispatch = () => {
  progress.value = 0
  dispatchLog.value = ['准备数据', '拆分工序', '分配可选设备']
  const timer = setInterval(() => {
    progress.value += 15
    if (progress.value >= 100) {
      progress.value = 100
      dispatchLog.value.push('派工单已生成并导出')
      clearInterval(timer)
    }
  }, 320)
}
</script>
