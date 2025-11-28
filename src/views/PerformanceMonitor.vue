<template>
  <div class="panel-grid">
    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">健康度</p>
          <h3>振动/温升趋势</h3>
        </div>
        <div class="chip">近30分钟</div>
      </header>
      <div class="chart">
        <svg viewBox="0 0 300 120" preserveAspectRatio="none">
          <polyline :points="vibrationPoints" fill="none" stroke="#e76f51" stroke-width="3" />
          <polyline :points="tempPoints" fill="none" stroke="#f4a261" stroke-width="3" />
        </svg>
        <div class="legend">
          <span class="legend__item"><span class="dot" style="background:#e76f51" />振动(mm/s)</span>
          <span class="legend__item"><span class="dot" style="background:#f4a261" />温度(℃)</span>
        </div>
      </div>
      <div class="buttons">
        <button @click="openProgress('推送巡检报告', 62)">导出报告</button>
        <button class="ghost" @click="showAlert = true">告警订阅</button>
      </div>
    </div>

    <div class="card">
      <header class="card__header">
        <div>
          <p class="eyebrow">事件表</p>
          <h3>故障与维护</h3>
        </div>
        <div class="chip ghost">共{{ events.length }}条</div>
      </header>
      <table class="data-table">
        <thead>
          <tr><th>时间</th><th>类型</th><th>描述</th><th>处理人</th><th>状态</th></tr>
        </thead>
        <tbody>
          <tr v-for="item in events" :key="item.time">
            <td>{{ item.time }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.desc }}</td>
            <td>{{ item.owner }}</td>
            <td><span class="tag" :class="item.status">{{ item.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <ModalDialog :show="showAlert" title="订阅告警" primary-text="保存订阅" @close="showAlert = false" @confirm="confirmAlert">
    <form class="form">
      <label>邮箱<input v-model="alertForm.email" placeholder="告警将发送至此邮箱" /></label>
      <label>阈值(振动 mm/s)<input v-model.number="alertForm.vibration" type="number" step="0.1" /></label>
      <label>阈值(温度 ℃)<input v-model.number="alertForm.temperature" type="number" /></label>
    </form>
  </ModalDialog>

  <ModalDialog :show="progress.show" :title="progress.title" :show-footer="false" @close="progress.show = false">
    <p class="muted">正在汇总数据并推送…</p>
    <div class="progress"><div class="progress__bar" :style="{ width: progress.value + '%' }"></div></div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ModalDialog from '../components/ModalDialog.vue'

const vibrationSeries = [0.6, 0.9, 1.2, 0.8, 1.4, 1.1]
const tempSeries = [42, 44, 46, 43, 45, 47]

const vibrationPoints = computed(() => vibrationSeries.map((v, i) => `${(i / 5) * 300},${120 - v * 40}`).join(' '))
const tempPoints = computed(() => tempSeries.map((v, i) => `${(i / 5) * 300},${120 - v}`).join(' '))

const events = reactive([
  { time: '10:12', type: '预警', desc: 'J3 轴振动接近阈值', owner: '陈杰', status: '处理中' },
  { time: '09:58', type: '维护', desc: '润滑周期已到期', owner: '王立', status: '待确认' },
  { time: '09:30', type: '告警', desc: '末端温度高于 55℃', owner: '李珊', status: '处理中' },
  { time: '09:10', type: '巡检', desc: '安全区边界校验完成', owner: '自动', status: '已完成' },
  { time: '08:42', type: '维护', desc: '更换减速器润滑脂', owner: '李珊', status: '已完成' }
])

const showAlert = ref(false)
const alertForm = reactive({ email: 'ops@arm.local', vibration: 1.5, temperature: 55 })
const progress = reactive({ show: false, title: '执行中', value: 0 })

const openProgress = (title, value) => {
  progress.title = title
  progress.value = value
  progress.show = true
  setTimeout(() => (progress.value = 100), 500)
}

const confirmAlert = () => {
  showAlert.value = false
  openProgress('订阅更新完成', 66)
}
</script>

<style scoped>
.panel-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 16px; }
.card { background: #fff; border: 1px solid var(--border); border-radius: 16px; padding: 16px; box-shadow: var(--shadow); display: flex; flex-direction: column; gap: 14px; }
.card__header { display: flex; justify-content: space-between; align-items: center; }
.eyebrow { color: var(--primary); font-weight: 700; letter-spacing: 0.06em; }
.chip { padding: 6px 10px; border-radius: 10px; background: #eaf7ff; color: #2d9cdb; font-weight: 700; }
.chip.ghost { background: #f1f4f9; color: #4a5568; }
.chart { background: #f9fbff; border: 1px dashed var(--border); border-radius: 12px; padding: 10px; }
svg { width: 100%; height: 120px; }
.legend { display: flex; gap: 16px; padding: 6px 4px 0; color: var(--muted); font-size: 13px; }
.legend__item { display: inline-flex; align-items: center; gap: 6px; }
.legend__item .dot { width: 12px; height: 12px; border-radius: 6px; }
.buttons { display: flex; gap: 10px; flex-wrap: wrap; }
.buttons button { flex: 1; border: none; border-radius: 12px; padding: 10px 12px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--primary), var(--primary-strong)); color: #fff; }
.buttons .ghost { background: #eef2f7; color: #1b2a3c; border: 1px solid var(--border); }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th, .data-table td { border-bottom: 1px solid var(--border); padding: 10px 8px; text-align: left; }
.data-table tbody tr:hover { background: #f9fbff; }
.tag { padding: 4px 8px; border-radius: 10px; font-weight: 700; }
.tag.处理中 { background: #fff3e0; color: #b95b03; }
.tag.待确认 { background: #eaf7ff; color: #1c7ab7; }
.tag.已完成 { background: #e5f7f0; color: #1b7f51; }
.form { display: flex; flex-direction: column; gap: 10px; }
.form label { display: flex; flex-direction: column; gap: 6px; font-weight: 600; color: #1b2a3c; }
.form input { border: 1px solid var(--border); border-radius: 10px; padding: 10px; }
.progress { height: 12px; border-radius: 12px; background: #eef2f7; overflow: hidden; }
.progress__bar { height: 100%; background: linear-gradient(135deg, var(--primary), var(--success)); transition: width 0.6s ease; }
.muted { color: var(--muted); }
</style>
