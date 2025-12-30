<template>
  <div class="section">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
      <h3>资源与车间建模</h3>
      <div class="actions">
        <button class="primary-btn" @click="openMachine">新增设备</button>
        <button class="secondary-btn" @click="openCalendar">班次日历</button>
        <button class="secondary-btn" @click="openMaintenance">维护计划</button>
      </div>
    </div>
    <p>设备台账、能力约束、换型/准备时间、故障窗口、人员工位统一建模。</p>

    <div class="section" style="margin-top:12px;">
      <h3>设备能力表（{{ machines.length }} 台）</h3>
      <table class="table">
        <thead>
          <tr>
            <th>设备</th>
            <th>可加工工序</th>
            <th>班次</th>
            <th>换型时间</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in machines" :key="m.name">
            <td>{{ m.name }}</td>
            <td>{{ m.ops }}</td>
            <td>{{ m.shift }}</td>
            <td>{{ m.setup }} min</td>
            <td><span class="badge" :class="m.status === '可用' ? 'success' : 'warn'">{{ m.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-grid" style="margin-top:16px;">
      <div class="metric-card">
        <h4>班次日历覆盖率</h4>
        <div v-for="day in calendar" :key="day.day" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ day.day }}</span><span>{{ day.coverage }}%</span>
          </div>
          <div class="chart-bar" :style="{width: day.coverage + '%', background:'linear-gradient(90deg,#34d399,#10b981)'}"></div>
        </div>
      </div>
      <div class="metric-card">
        <h4>人员/工位利用率</h4>
        <div v-for="staff in staffLoad" :key="staff.name" style="margin:6px 0;">
          <div style="display:flex;justify-content:space-between;font-size:13px;color:#475569;">
            <span>{{ staff.name }}</span><span>{{ staff.util }}%</span>
          </div>
          <div class="chart-bar" :style="{width: staff.util + '%', background:'linear-gradient(90deg,#f97316,#f59e0b)'}"></div>
        </div>
      </div>
    </div>

    <BaseModal v-if="showMachine" title="新增设备" @close="showMachine=false">
      <form class="form" @submit.prevent="saveMachine">
        <label>设备编号<input v-model="machineForm.name" required /></label>
        <label>可加工工序<input v-model="machineForm.ops" required placeholder="OP10/OP20" /></label>
        <label>班次<input v-model="machineForm.shift" required placeholder="早班/中班/晚班" /></label>
        <label>换型时间<input v-model.number="machineForm.setup" type="number" required /></label>
        <button class="primary-btn" type="submit">保存</button>
      </form>
    </BaseModal>

    <BaseModal v-if="showCalendar" title="班次日历配置" @close="showCalendar=false">
      <p>调整周内班次、法定假日与加班窗口。</p>
      <table class="table">
        <thead>
          <tr><th>星期</th><th>班次</th><th>开机小时</th></tr>
        </thead>
        <tbody>
          <tr v-for="day in calendar" :key="day.day">
            <td>{{ day.day }}</td>
            <td>{{ day.shift }}</td>
            <td>{{ day.hours }}</td>
          </tr>
        </tbody>
      </table>
    </BaseModal>

    <BaseModal v-if="showMaintenance" title="维护计划" @close="showMaintenance=false">
      <p>下周期维护/故障窗口将锁定设备，不参与排程。</p>
      <ul>
        <li v-for="m in maintenance" :key="m.machine">{{ m.machine }}：{{ m.window }}</li>
      </ul>
      <button class="primary-btn" @click="pushMaintenance">下发维护指令</button>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import BaseModal from '../components/BaseModal.vue'

const machines = ref(
  Array.from({ length: 20 }).map((_, idx) => ({
    name: `M${String(idx + 1).padStart(2, '0')}`,
    ops: ['OP10', 'OP20', 'OP30', 'OP40'].slice(idx % 4).join('/'),
    shift: ['早班', '中班', '晚班'][idx % 3],
    setup: 10 + (idx % 5) * 5,
    status: idx % 5 === 0 ? '检修' : '可用'
  }))
)

const calendar = ref([
  { day: '周一', shift: '早/中/晚', hours: 22, coverage: 98 },
  { day: '周二', shift: '早/中', hours: 18, coverage: 90 },
  { day: '周三', shift: '早/中/晚', hours: 22, coverage: 96 },
  { day: '周四', shift: '早/晚', hours: 16, coverage: 82 },
  { day: '周五', shift: '早/中/晚', hours: 22, coverage: 95 },
  { day: '周六', shift: '中/晚', hours: 14, coverage: 72 },
  { day: '周日', shift: '维护', hours: 8, coverage: 40 }
])

const staffLoad = ref([
  { name: '焊接工位', util: 76 },
  { name: '装配工位', util: 64 },
  { name: '检验工位', util: 58 },
  { name: '仓储', util: 43 }
])

const maintenance = ref([
  { machine: 'M03', window: '周日 08:00-16:00' },
  { machine: 'M10', window: '周三 14:00-18:00' },
  { machine: 'M17', window: '周六 09:00-15:00' }
])

const showMachine = ref(false)
const showCalendar = ref(false)
const showMaintenance = ref(false)
const machineForm = reactive({ name: 'M21', ops: 'OP10/OP30', shift: '早班', setup: 15 })

const openMachine = () => (showMachine.value = true)
const openCalendar = () => (showCalendar.value = true)
const openMaintenance = () => (showMaintenance.value = true)

const saveMachine = () => {
  machines.value.push({ ...machineForm, status: '可用' })
  showMachine.value = false
}

const pushMaintenance = () => {
  maintenance.value.push({ machine: 'M21', window: '下周一 08:00-12:00' })
}
</script>
