<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>运动控制与过程执行</h2>
        <p>多轴联动执行、加工节拍控制与暂停续切。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('start')">启动切割</button>
        <button class="ghost" @click="openModal('pause')">暂停续切</button>
        <button class="ghost" @click="openModal('calibrate')">伺服校准</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>实时运动曲线</h3>
        <svg viewBox="0 0 420 160" class="line-chart">
          <polyline points="0,120 40,98 80,104 120,70 160,80 200,60 240,72 280,46 320,58 360,40 420,52" />
        </svg>
        <div class="metrics">
          <div>
            <strong>1.62 m/s</strong>
            <span>当前进给速度</span>
          </div>
          <div>
            <strong>0.03 mm</strong>
            <span>同步误差</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>过程控制指令</h3>
        <div class="command-list">
          <div v-for="cmd in commands" :key="cmd.label" class="command-item">
            <div>
              <strong>{{ cmd.label }}</strong>
              <p>{{ cmd.detail }}</p>
            </div>
            <span class="tag">{{ cmd.state }}</span>
          </div>
        </div>
        <button class="primary" @click="openModal('override')">下发控制指令</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <h3>切割执行批次</h3>
        <button class="ghost" @click="openModal('report')">导出过程报告</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>批次编号</th>
              <th>任务名称</th>
              <th>开始时间</th>
              <th>完成进度</th>
              <th>刀具负载</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.task }}</td>
              <td>{{ row.start }}</td>
              <td>{{ row.progress }}</td>
              <td>{{ row.load }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" :onClose="closeModal">
      <div v-if="modal.type === 'start'" class="form-grid">
        <label>
          选择批次
          <select v-model="form.batch">
            <option>PB-2409-A</option>
            <option>PB-2409-B</option>
            <option>PB-2409-C</option>
          </select>
        </label>
        <label>
          起始工位
          <input v-model="form.station" type="text" />
        </label>
        <label>
          目标速度
          <input v-model="form.speed" type="number" />
        </label>
      </div>
      <div v-else-if="modal.type === 'pause'" class="info-block">
        <p>已定位到暂停点，系统可在 15 秒内恢复至同步状态。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>安全缓存缓冲中...</small>
      </div>
      <div v-else-if="modal.type === 'calibrate'" class="info-block">
        <p>伺服校准完成，以下轴系需要二次确认：</p>
        <ul>
          <li>X 轴定位误差 0.02 mm</li>
          <li>R 轴角度偏差 0.15°</li>
        </ul>
      </div>
      <div v-else-if="modal.type === 'override'" class="form-grid">
        <label>
          指令类型
          <select v-model="form.command">
            <option>进给补偿</option>
            <option>刀具冷却增强</option>
            <option>动态减速</option>
          </select>
        </label>
        <label>
          生效时间
          <input v-model="form.time" type="text" />
        </label>
        <label>
          备注
          <input v-model="form.note" type="text" />
        </label>
      </div>
      <div v-else class="info-block">
        <p>过程报告将导出为 PDF，包含运动曲线、停机点与异常统计。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <template #footer>
        <button class="ghost" type="button" @click="closeModal">关闭</button>
        <button class="primary" type="button" @click="confirmModal">确认执行</button>
      </template>
    </Modal>
  </section>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import Modal from '../components/Modal.vue';

const commands = [
  { label: '多轴同步', detail: '联动 7 轴，误差阈值 0.05mm', state: '运行中' },
  { label: '缓冲补偿', detail: '末端轨迹平滑 0.08mm', state: '已启用' },
  { label: '刀具冷却', detail: '冷却流量 1.2L/min', state: '自动' }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `PC-${(index + 1).toString().padStart(3, '0')}`,
  task: `切割任务-${index + 5}`,
  start: `09:${(index + 10).toString().padStart(2, '0')}`,
  progress: `${65 + (index % 5) * 7}%`,
  load: `${48 + index % 6}%`,
  status: index % 4 === 0 ? '执行中' : '排队'
}));

const modal = ref({
  show: false,
  type: 'start',
  title: ''
});

const form = ref({
  batch: 'PB-2409-A',
  station: '切割台 B2',
  speed: 1.6,
  command: '进给补偿',
  time: '立即生效',
  note: '针对细节轮廓'
});

const progress = ref(40);
const timer = ref(null);

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
  modal.value.title =
    type === 'start'
      ? '启动切割任务'
      : type === 'pause'
      ? '暂停与续切'
      : type === 'calibrate'
      ? '伺服校准结果'
      : type === 'override'
      ? '下发控制指令'
      : '导出过程报告';
  if (type === 'pause' || type === 'report') {
    progress.value = 40;
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      progress.value = Math.min(progress.value + 10, 100);
    }, 300);
  }
};

const closeModal = () => {
  modal.value.show = false;
  if (timer.value) clearInterval(timer.value);
};

const confirmModal = () => {
  closeModal();
};

onBeforeUnmount(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<style scoped>
.module {
  display: grid;
  gap: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.module-header p {
  color: var(--muted);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.primary,
.ghost {
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.primary {
  background: var(--primary);
  color: white;
}

.ghost {
  background: white;
  border: 1px solid var(--border);
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: var(--card);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  display: grid;
  gap: 16px;
}

.line-chart {
  width: 100%;
  height: 160px;
}

.line-chart polyline {
  fill: none;
  stroke: var(--primary);
  stroke-width: 4;
  stroke-linecap: round;
}

.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.metrics span {
  color: var(--muted);
  font-size: 12px;
}

.command-list {
  display: grid;
  gap: 12px;
}

.command-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9ff;
  border-radius: 12px;
  padding: 10px 12px;
}

.command-item p {
  color: var(--muted);
  font-size: 13px;
}

.tag {
  background: #eef7ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.table-card {
  gap: 12px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-wrap {
  overflow: auto;
}

th,
td {
  text-align: left;
  padding: 10px 12px;
  font-size: 13px;
  border-bottom: 1px solid var(--border);
}

.form-grid {
  display: grid;
  gap: 12px;
}

.form-grid label {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.form-grid input,
.form-grid select {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 10px;
}

.info-block {
  display: grid;
  gap: 12px;
}

.progress {
  background: #e7eefc;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
  transition: width 0.3s ease;
}
</style>
