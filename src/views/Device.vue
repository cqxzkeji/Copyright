<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>设备接入与管理</h2>
        <p>统一管理多型号机械臂与传感器，确保设备状态可视化。</p>
      </div>
      <div class="actions">
        <button class="primary" type="button" @click="openModal('register')">设备登记</button>
        <button class="ghost" type="button" @click="openModal('config')">参数配置</button>
        <button class="ghost" type="button" @click="openModal('diagnose')">远程自检</button>
        <button class="ghost" type="button" @click="openModal('firmware')">同步固件</button>
        <button class="ghost" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>设备接入概览</h3>
        <svg class="chart" viewBox="0 0 240 120" role="img" aria-label="设备接入趋势">
          <polyline points="10,90 50,60 90,70 130,40 170,50 210,30" fill="none" stroke="#2563eb" stroke-width="4" />
          <circle v-for="point in chartPoints" :key="point.x" :cx="point.x" :cy="point.y" r="5" fill="#38bdf8" />
        </svg>
        <div class="stat-row">
          <div>
            <span>接入设备</span>
            <strong>42</strong>
          </div>
          <div>
            <span>在线率</span>
            <strong>96%</strong>
          </div>
          <div>
            <span>报警中</span>
            <strong>2</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>传感器状态</h3>
        <ul class="status-list">
          <li v-for="sensor in sensors" :key="sensor.id">
            <span>{{ sensor.name }}</span>
            <span :class="['badge', sensor.status]">{{ sensor.label }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>设备清单</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>设备编号</th>
              <th>类型</th>
              <th>部署区域</th>
              <th>负载能力</th>
              <th>连接状态</th>
              <th>固件版本</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in devices" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.zone }}</td>
              <td>{{ item.load }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.firmware }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="activeModal = ''" @confirm="confirmModal">
      <template v-if="activeModal === 'register'">
        <p>登记新设备并绑定通信协议。</p>
        <div class="form-grid">
          <label>
            设备编号
            <input v-model="form.serial" type="text" placeholder="ARM-2024-001" />
          </label>
          <label>
            设备型号
            <input v-model="form.model" type="text" placeholder="协作型六轴" />
          </label>
          <label>
            接入协议
            <select v-model="form.protocol">
              <option>EtherCAT</option>
              <option>Profinet</option>
              <option>OPC UA</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'config'">
        <p>配置机械臂运行参数与传感器采样周期。</p>
        <div class="form-grid">
          <label>
            最大速度 (m/s)
            <input v-model="form.speed" type="number" min="0" step="0.1" />
          </label>
          <label>
            采样周期 (ms)
            <input v-model="form.interval" type="number" min="1" />
          </label>
          <label>
            安全模式
            <select v-model="form.safety">
              <option>标准</option>
              <option>敏感</option>
              <option>冗余</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'diagnose'">
        <p>执行全链路自检，预计耗时 45 秒。</p>
        <div class="progress-box">
          <div class="progress-info">
            <span>自检进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <label>
            自检范围
            <select v-model="form.scope">
              <option>关节驱动</option>
              <option>传感器阵列</option>
              <option>通信链路</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'firmware'">
        <p>批量同步固件版本，确保一致性。</p>
        <div class="form-grid">
          <label>
            目标版本
            <input v-model="form.firmware" type="text" placeholder="v4.8.2" />
          </label>
          <label>
            同步批次
            <input v-model="form.batch" type="text" placeholder="批次-03" />
          </label>
          <label>
            计划窗口
            <select v-model="form.window">
              <option>立即执行</option>
              <option>夜间低负载</option>
              <option>人工确认</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：当前设备接入高峰期，请优先排队登记。</p>
        <div class="form-grid">
          <label>
            通知范围
            <select v-model="form.notice">
              <option>控制中心</option>
              <option>维护团队</option>
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
const progress = ref(72)
const chartPoints = [
  { x: 10, y: 90 },
  { x: 50, y: 60 },
  { x: 90, y: 70 },
  { x: 130, y: 40 },
  { x: 170, y: 50 },
  { x: 210, y: 30 }
]

const sensors = [
  { id: 1, name: '力矩传感器', status: 'ok', label: '正常' },
  { id: 2, name: '视觉定位', status: 'ok', label: '正常' },
  { id: 3, name: '温度阵列', status: 'warn', label: '偏高' },
  { id: 4, name: '振动监测', status: 'ok', label: '正常' },
  { id: 5, name: '末端力控', status: 'ok', label: '正常' }
]

const devices = Array.from({ length: 24 }, (_, index) => ({
  id: `ARM-${String(index + 1).padStart(3, '0')}`,
  type: index % 2 === 0 ? '协作型六轴' : '重载七轴',
  zone: ['装配线', '检测区', '仓储区'][index % 3],
  load: `${12 + (index % 5) * 3} kg`,
  status: index % 5 === 0 ? '维护' : '在线',
  firmware: `v4.${6 + (index % 4)}.${index % 9}`
}))

const form = reactive({
  serial: '',
  model: '',
  protocol: 'EtherCAT',
  speed: 1.6,
  interval: 20,
  safety: '标准',
  scope: '关节驱动',
  firmware: 'v4.8.2',
  batch: '批次-03',
  window: '立即执行',
  notice: '控制中心',
  note: ''
})

const modalTitle = computed(() => {
  const map = {
    register: '设备登记',
    config: '参数配置',
    diagnose: '远程自检进度',
    firmware: '固件同步',
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

.stat-row strong {
  font-size: 18px;
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
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.badge.ok {
  background: #dcfce7;
  color: #15803d;
}

.badge.warn {
  background: #fef9c3;
  color: #a16207;
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
  background: linear-gradient(90deg, #38bdf8, #2563eb);
}
</style>
