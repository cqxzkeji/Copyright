<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>运动控制与轨迹规划</h2>
        <p>支持多轴运动控制与轨迹规划，保障动作精度与稳定性。</p>
      </div>
      <div class="actions">
        <button class="primary" type="button" @click="openModal('plan')">轨迹生成</button>
        <button class="ghost" type="button" @click="openModal('smooth')">平滑校准</button>
        <button class="ghost" type="button" @click="openModal('speed')">速度调整</button>
        <button class="ghost" type="button" @click="openModal('simulate')">执行预演</button>
        <button class="ghost" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>轨迹平滑度</h3>
        <svg class="chart" viewBox="0 0 240 120" aria-label="轨迹平滑度">
          <rect v-for="(bar, index) in bars" :key="index" :x="12 + index * 28" :y="120 - bar" :width="16" :height="bar" rx="6" fill="#60a5fa" />
        </svg>
        <div class="stat-row">
          <div>
            <span>平均误差</span>
            <strong>0.08 mm</strong>
          </div>
          <div>
            <span>轨迹片段</span>
            <strong>128</strong>
          </div>
          <div>
            <span>加速度峰值</span>
            <strong>1.4 m/s²</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>控制策略</h3>
        <ul class="status-list">
          <li v-for="strategy in strategies" :key="strategy.id">
            <span>{{ strategy.name }}</span>
            <span class="badge">{{ strategy.value }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>轨迹任务列表</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>轴数</th>
              <th>目标工位</th>
              <th>周期(s)</th>
              <th>平滑级别</th>
              <th>执行状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.axis }}</td>
              <td>{{ task.station }}</td>
              <td>{{ task.duration }}</td>
              <td>{{ task.smooth }}</td>
              <td>{{ task.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="activeModal = ''" @confirm="confirmModal">
      <template v-if="activeModal === 'plan'">
        <p>生成新的轨迹规划任务并指定目标工位。</p>
        <div class="form-grid">
          <label>
            任务名称
            <input v-model="form.name" type="text" placeholder="搬运轨迹-A" />
          </label>
          <label>
            目标工位
            <input v-model="form.station" type="text" placeholder="工位-05" />
          </label>
          <label>
            控制模式
            <select v-model="form.mode">
              <option>前馈+反馈</option>
              <option>预测控制</option>
              <option>自适应阻抗</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'smooth'">
        <p>校准轨迹平滑参数以提升过渡连续性。</p>
        <div class="form-grid">
          <label>
            平滑半径(mm)
            <input v-model="form.radius" type="number" min="0" step="0.1" />
          </label>
          <label>
            采样密度
            <input v-model="form.density" type="number" min="10" />
          </label>
          <label>
            优化策略
            <select v-model="form.optimizer">
              <option>曲率优先</option>
              <option>能耗优先</option>
              <option>时间优先</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'speed'">
        <p>调整多轴速度与加速度上限。</p>
        <div class="form-grid">
          <label>
            速度倍率
            <input v-model="form.speed" type="number" min="0.5" step="0.1" />
          </label>
          <label>
            加速度上限
            <input v-model="form.acc" type="number" min="0" step="0.1" />
          </label>
          <label>
            过载保护
            <select v-model="form.guard">
              <option>启用</option>
              <option>关闭</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'simulate'">
        <p>运行虚拟预演，检查碰撞与节拍。</p>
        <div class="progress-box">
          <div class="progress-info">
            <span>预演进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <label>
            模拟环境
            <select v-model="form.env">
              <option>标准工位</option>
              <option>柔性产线</option>
              <option>重载作业</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：当前轨迹正在高优先级执行，请谨慎调整参数。</p>
        <div class="form-grid">
          <label>
            通知对象
            <select v-model="form.notice">
              <option>调度中心</option>
              <option>工程团队</option>
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
const progress = ref(64)
const bars = [40, 70, 55, 85, 60, 78, 50]

const strategies = [
  { id: 1, name: '速度规划', value: 'S 曲线' },
  { id: 2, name: '关节补偿', value: '动态补偿' },
  { id: 3, name: '路径约束', value: '最短轨迹' },
  { id: 4, name: '振动抑制', value: '启用' }
]

const tasks = Array.from({ length: 22 }, (_, index) => ({
  id: `TRJ-${120 + index}`,
  axis: 6 + (index % 2),
  station: `工位-${String((index % 8) + 1).padStart(2, '0')}`,
  duration: (12 + index % 6).toFixed(1),
  smooth: ['高', '中', '低'][index % 3],
  status: index % 5 === 0 ? '待优化' : '执行中'
}))

const form = reactive({
  name: '',
  station: '',
  mode: '前馈+反馈',
  radius: 1.2,
  density: 60,
  optimizer: '曲率优先',
  speed: 1.0,
  acc: 1.5,
  guard: '启用',
  env: '标准工位',
  notice: '调度中心',
  note: ''
})

const modalTitle = computed(() => {
  const map = {
    plan: '轨迹生成',
    smooth: '平滑校准',
    speed: '速度调整',
    simulate: '执行预演',
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
  background: #dbeafe;
  color: #1d4ed8;
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
  background: linear-gradient(90deg, #7dd3fc, #2563eb);
}
</style>
