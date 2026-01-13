<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>运行监控与安全防护</h2>
        <p>实时监控运行状态，提供报警、限位与安全保护功能。</p>
      </div>
      <div class="actions">
        <button class="primary" type="button" @click="openModal('alert')">报警配置</button>
        <button class="ghost" type="button" @click="openModal('limit')">限位设置</button>
        <button class="ghost" type="button" @click="openModal('drill')">紧急演练</button>
        <button class="ghost" type="button" @click="openModal('export')">日志导出</button>
        <button class="ghost" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>安全状态趋势</h3>
        <svg class="chart" viewBox="0 0 240 120" aria-label="安全趋势">
          <path d="M10 90 Q60 40 110 70 T230 40" fill="none" stroke="#22c55e" stroke-width="4" />
          <path d="M10 100 Q60 70 110 80 T230 60" fill="none" stroke="#f97316" stroke-width="3" />
        </svg>
        <div class="stat-row">
          <div>
            <span>安全评分</span>
            <strong>92</strong>
          </div>
          <div>
            <span>触发报警</span>
            <strong>5</strong>
          </div>
          <div>
            <span>自动停机</span>
            <strong>0</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>关键防护机制</h3>
        <ul class="status-list">
          <li v-for="guard in guards" :key="guard.id">
            <span>{{ guard.name }}</span>
            <span class="badge">{{ guard.value }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>报警与事件记录</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>事件编号</th>
              <th>时间</th>
              <th>设备</th>
              <th>事件类型</th>
              <th>级别</th>
              <th>处理状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in events" :key="event.id">
              <td>{{ event.id }}</td>
              <td>{{ event.time }}</td>
              <td>{{ event.device }}</td>
              <td>{{ event.type }}</td>
              <td>{{ event.level }}</td>
              <td>{{ event.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="activeModal = ''" @confirm="confirmModal">
      <template v-if="activeModal === 'alert'">
        <p>配置报警阈值与通知规则。</p>
        <div class="form-grid">
          <label>
            震动阈值(g)
            <input v-model="form.vibration" type="number" min="0" step="0.1" />
          </label>
          <label>
            温度上限(℃)
            <input v-model="form.temp" type="number" min="0" />
          </label>
          <label>
            通知渠道
            <select v-model="form.channel">
              <option>短信</option>
              <option>邮件</option>
              <option>控制台广播</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'limit'">
        <p>设置安全限位与作业边界。</p>
        <div class="form-grid">
          <label>
            X 轴限位(mm)
            <input v-model="form.limitX" type="number" />
          </label>
          <label>
            Y 轴限位(mm)
            <input v-model="form.limitY" type="number" />
          </label>
          <label>
            Z 轴限位(mm)
            <input v-model="form.limitZ" type="number" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'drill'">
        <p>执行紧急停机演练并生成记录。</p>
        <div class="progress-box">
          <div class="progress-info">
            <span>演练进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <label>
            演练范围
            <select v-model="form.drillScope">
              <option>整线联动</option>
              <option>单机演练</option>
              <option>传感器演练</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'export'">
        <p>导出日志并生成审计报告。</p>
        <div class="form-grid">
          <label>
            日志周期
            <select v-model="form.period">
              <option>近 24 小时</option>
              <option>近 7 天</option>
              <option>近 30 天</option>
            </select>
          </label>
          <label>
            文件格式
            <select v-model="form.format">
              <option>CSV</option>
              <option>PDF</option>
              <option>JSON</option>
            </select>
          </label>
          <label>
            接收邮箱
            <input v-model="form.email" type="email" placeholder="ops@example.com" />
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：安全评分低于 90 的设备需安排巡检。</p>
        <div class="form-grid">
          <label>
            通知对象
            <select v-model="form.notice">
              <option>安全主管</option>
              <option>运维团队</option>
              <option>全部人员</option>
            </select>
          </label>
          <label>
            备注
            <input v-model="form.note" type="text" placeholder="请输入提示备注" />
          </label>
        </div>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import Modal from '../components/Modal.vue'

const activeModal = ref('')
const progress = ref(46)

const guards = [
  { id: 1, name: '急停回路', value: '在线' },
  { id: 2, name: '限位保护', value: '启用' },
  { id: 3, name: '防撞监测', value: '正常' },
  { id: 4, name: '安全光幕', value: '开启' }
]

const events = Array.from({ length: 23 }, (_, index) => ({
  id: `ALM-${520 + index}`,
  time: `09:${String(10 + index).padStart(2, '0')}`,
  device: `ARM-${String((index % 12) + 1).padStart(2, '0')}`,
  type: ['振动偏高', '温度偏高', '传感器异常'][index % 3],
  level: ['中', '高', '低'][index % 3],
  status: index % 4 === 0 ? '处理中' : '已归档'
}))

const form = reactive({
  vibration: 0.8,
  temp: 62,
  channel: '短信',
  limitX: 1200,
  limitY: 900,
  limitZ: 600,
  drillScope: '整线联动',
  period: '近 7 天',
  format: 'PDF',
  email: '',
  notice: '安全主管',
  note: ''
})

const modalTitle = computed(() => {
  const map = {
    alert: '报警配置',
    limit: '限位设置',
    drill: '紧急演练',
    export: '日志导出',
    tip: '提示信息'
  }
  return map[activeModal.value] || '提示信息'
})

const openModal = (type) => {
  activeModal.value = type
}

const confirmModal = () => {
  activeModal.value = ''
}
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.ghost {
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.card {
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(148, 163, 184, 0.25);
  display: grid;
  gap: 16px;
}

.chart {
  width: 100%;
  height: 140px;
}

.stat-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 12px;
}

.status-list {
  list-style: none;
  display: grid;
  gap: 12px;
}

.status-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f8fafc;
}

.badge {
  background: #dcfce7;
  color: #15803d;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-wrap {
  overflow-x: auto;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
}

thead {
  background: #f1f5f9;
}

tbody tr:nth-child(even) {
  background: #f8fafc;
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 14px;
}

.form-grid input,
.form-grid select {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 8px 10px;
  background: #f8fafc;
}

.progress-box {
  display: grid;
  gap: 12px;
}

.progress-info {
  display: flex;
  justify-content: space-between;
}

.progress-bar {
  background: #e2e8f0;
  border-radius: 999px;
  height: 12px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: linear-gradient(90deg, #4ade80, #16a34a);
}
</style>
