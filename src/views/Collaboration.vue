<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>多臂协同与自适应控制</h2>
        <p>多机械臂协同作业，根据负载与环境变化自动调整控制参数。</p>
      </div>
      <div class="actions">
        <button class="primary" type="button" @click="openModal('orchestration')">协同编排</button>
        <button class="ghost" type="button" @click="openModal('adaptive')">负载自适应</button>
        <button class="ghost" type="button" @click="openModal('zone')">协作区域</button>
        <button class="ghost" type="button" @click="openModal('conflict')">冲突解析</button>
        <button class="ghost" type="button" @click="openModal('tip')">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>协同效率雷达</h3>
        <svg class="chart" viewBox="0 0 200 160" aria-label="协同效率雷达">
          <polygon points="100,20 170,60 150,130 50,130 30,60" fill="#dbeafe" />
          <polygon points="100,40 150,70 130,120 70,120 50,70" fill="#60a5fa" opacity="0.6" />
          <circle cx="100" cy="80" r="4" fill="#1d4ed8" />
        </svg>
        <div class="stat-row">
          <div>
            <span>协同任务</span>
            <strong>12</strong>
          </div>
          <div>
            <span>自适应调参</span>
            <strong>38 次</strong>
          </div>
          <div>
            <span>负载裕度</span>
            <strong>21%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>协作节点</h3>
        <ul class="status-list">
          <li v-for="node in nodes" :key="node.id">
            <span>{{ node.name }}</span>
            <span class="badge">{{ node.value }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="card">
      <h3>协同任务排程</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>参与机械臂</th>
              <th>协作模式</th>
              <th>负载比</th>
              <th>当前策略</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in tasks" :key="task.id">
              <td>{{ task.id }}</td>
              <td>{{ task.arms }}</td>
              <td>{{ task.mode }}</td>
              <td>{{ task.load }}</td>
              <td>{{ task.strategy }}</td>
              <td>{{ task.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal v-if="activeModal" :title="modalTitle" @close="activeModal = ''" @confirm="confirmModal">
      <template v-if="activeModal === 'orchestration'">
        <p>配置多臂协同作业编排规则。</p>
        <div class="form-grid">
          <label>
            作业名称
            <input v-model="form.name" type="text" placeholder="双臂装配线" />
          </label>
          <label>
            协作顺序
            <input v-model="form.sequence" type="text" placeholder="ARM-01 → ARM-03" />
          </label>
          <label>
            协同模式
            <select v-model="form.mode">
              <option>接力</option>
              <option>并行</option>
              <option>主从</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'adaptive'">
        <p>根据实时负载自动调整控制参数。</p>
        <div class="progress-box">
          <div class="progress-info">
            <span>调参进度</span>
            <strong>{{ progress }}%</strong>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: progress + '%' }"></div>
          </div>
          <label>
            目标负载区间
            <input v-model="form.loadRange" type="text" placeholder="55%-75%" />
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'zone'">
        <p>定义多臂协作空间与避让边界。</p>
        <div class="form-grid">
          <label>
            协作区域
            <input v-model="form.zone" type="text" placeholder="B-02 区域" />
          </label>
          <label>
            安全距离(mm)
            <input v-model="form.distance" type="number" min="0" step="1" />
          </label>
          <label>
            可视化层级
            <select v-model="form.layer">
              <option>三维视图</option>
              <option>二维投影</option>
            </select>
          </label>
        </div>
      </template>
      <template v-else-if="activeModal === 'conflict'">
        <p>处理协作冲突与优先级分配。</p>
        <div class="form-grid">
          <label>
            冲突编号
            <input v-model="form.conflictId" type="text" placeholder="CFT-06" />
          </label>
          <label>
            处理策略
            <select v-model="form.policy">
              <option>优先级重排</option>
              <option>停机避让</option>
              <option>路径重规划</option>
            </select>
          </label>
          <label>
            责任臂
            <input v-model="form.owner" type="text" placeholder="ARM-05" />
          </label>
        </div>
      </template>
      <template v-else>
        <p>提示：当前协作区域负载接近上限，请关注调度。</p>
        <div class="form-grid">
          <label>
            通知对象
            <select v-model="form.notice">
              <option>调度中心</option>
              <option>现场工程师</option>
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
const progress = ref(58)

const nodes = [
  { id: 1, name: '主控协调', value: '稳定' },
  { id: 2, name: '负载预测', value: '优化中' },
  { id: 3, name: '避让控制', value: '开启' },
  { id: 4, name: '互锁机制', value: '在线' }
]

const tasks = Array.from({ length: 21 }, (_, index) => ({
  id: `COL-${300 + index}`,
  arms: index % 3 === 0 ? 'ARM-01/ARM-02' : 'ARM-03/ARM-05',
  mode: ['并行', '主从', '接力'][index % 3],
  load: `${55 + (index % 4) * 5}%`,
  strategy: ['均衡', '优先主臂', '动态分配'][index % 3],
  status: index % 4 === 0 ? '待确认' : '协同中'
}))

const form = reactive({
  name: '',
  sequence: '',
  mode: '接力',
  loadRange: '55%-75%',
  zone: '',
  distance: 280,
  layer: '三维视图',
  conflictId: '',
  policy: '优先级重排',
  owner: '',
  notice: '调度中心',
  note: ''
})

const modalTitle = computed(() => {
  const map = {
    orchestration: '协同编排',
    adaptive: '负载自适应',
    zone: '协作区域设置',
    conflict: '冲突解析',
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
  height: 160px;
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
  background: #e0f2fe;
  color: #0369a1;
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
  background: linear-gradient(90deg, #60a5fa, #1d4ed8);
}
</style>
