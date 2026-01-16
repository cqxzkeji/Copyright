<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>打磨工序调度与作业优化</h2>
        <p>多工位、多设备动态派工与顺序优化，减少等待时间。</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="openOptimize">调度优化</button>
        <button class="btn ghost" type="button" @click="openAssign">派工执行</button>
        <button class="btn ghost" type="button" @click="openHint">提示信息</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>工位负载分布</h3>
        <svg viewBox="0 0 320 140" class="chart">
          <polyline
            fill="none"
            stroke="#3b82f6"
            stroke-width="4"
            points="10,110 60,80 110,90 160,50 210,70 260,40 310,60"
          />
          <circle v-for="(point, index) in points" :key="index" :cx="point.x" :cy="point.y" r="4" fill="#1d4ed8" />
        </svg>
        <div class="legend">
          <span>W1</span>
          <span>W2</span>
          <span>W3</span>
          <span>W4</span>
          <span>W5</span>
          <span>W6</span>
          <span>W7</span>
        </div>
      </div>
      <div class="card">
        <h3>关键指标</h3>
        <div class="kpi-list">
          <div>
            <strong>56 秒</strong>
            <span>平均节拍</span>
          </div>
          <div>
            <strong>92%</strong>
            <span>工位负载率</span>
          </div>
          <div>
            <strong>1.8 小时</strong>
            <span>待加工时长</span>
          </div>
          <div>
            <strong>12 单</strong>
            <span>在制任务</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>打磨任务调度表</h3>
        <button class="btn ghost" type="button" @click="openConfirm">批量确认</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>任务号</th>
            <th>工位</th>
            <th>设备</th>
            <th>工序</th>
            <th>预计时长</th>
            <th>优先级</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.task }}</td>
            <td>{{ row.station }}</td>
            <td>{{ row.machine }}</td>
            <td>{{ row.step }}</td>
            <td>{{ row.duration }}</td>
            <td>{{ row.priority }}</td>
            <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :open="optimizeModal" title="调度优化进度" @close="optimizeModal = false">
      <p>系统正在计算最优顺序与工位分配。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${optimizeProgress}%` }"></div>
      </div>
      <p class="muted">已优化 {{ optimizeProgress }}%，预计减少等待 18%。</p>
    </Modal>

    <Modal :open="assignModal" title="派工执行" confirm-text="下发任务" @close="assignModal = false" @confirm="assignModal = false">
      <div class="form-grid">
        <label>
          目标工位
          <select v-model="assign.station">
            <option>W1 精磨</option>
            <option>W2 倒角</option>
            <option>W3 去毛刺</option>
            <option>W4 精整</option>
          </select>
        </label>
        <label>
          任务批次
          <input v-model="assign.batch" type="text" />
        </label>
        <label>
          预计件数
          <input v-model="assign.qty" type="number" />
        </label>
        <label class="full">
          备注
          <textarea v-model="assign.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="hintModal" title="提示信息" @close="hintModal = false">
      <ul class="notice-list">
        <li>W3 工位即将到达磨料更换时限，建议安排 16:00 前完成。</li>
        <li>SN-2024-082 批次需优先完成倒角工序。</li>
        <li>打磨 2 号设备温升偏高，注意冷却液补充。</li>
      </ul>
    </Modal>

    <Modal :open="confirmModal" title="批量确认" confirm-text="确认完成" @close="confirmModal = false" @confirm="confirmModal = false">
      <p>请选择需要确认完成的任务批次。</p>
      <div class="chips">
        <span v-for="chip in ['SN-082', 'SN-083', 'SN-084', 'SN-085']" :key="chip">{{ chip }}</span>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import Modal from '../components/Modal.vue';

const optimizeModal = ref(false);
const assignModal = ref(false);
const hintModal = ref(false);
const confirmModal = ref(false);
const optimizeProgress = ref(0);
let optimizeTimer;

const points = [
  { x: 10, y: 110 },
  { x: 60, y: 80 },
  { x: 110, y: 90 },
  { x: 160, y: 50 },
  { x: 210, y: 70 },
  { x: 260, y: 40 },
  { x: 310, y: 60 }
];

const assign = reactive({
  station: 'W3 去毛刺',
  batch: 'SN-2024-082',
  qty: 240,
  note: '优先处理急单。'
});

const rows = computed(() =>
  Array.from({ length: 24 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      task: `GD-${String(id).padStart(3, '0')}`,
      station: `W${(id % 6) + 1}`,
      machine: `GM-${(id % 5) + 1}`,
      step: id % 3 === 0 ? '倒角' : id % 3 === 1 ? '去毛刺' : '精整',
      duration: `${40 + (id % 4) * 6} 秒`,
      priority: id % 4 === 0 ? '高' : '中',
      status: id % 5 === 0 ? '待开始' : '执行中',
      statusClass: id % 5 === 0 ? 'warn' : 'good'
    };
  })
);

const openOptimize = () => {
  optimizeModal.value = true;
};

const openAssign = () => {
  assignModal.value = true;
};

const openHint = () => {
  hintModal.value = true;
};

const openConfirm = () => {
  confirmModal.value = true;
};

watchEffect(() => {
  if (optimizeModal.value) {
    optimizeProgress.value = 0;
    optimizeTimer = setInterval(() => {
      optimizeProgress.value = Math.min(optimizeProgress.value + 10, 100);
      if (optimizeProgress.value === 100) {
        clearInterval(optimizeTimer);
      }
    }, 180);
  } else if (optimizeTimer) {
    clearInterval(optimizeTimer);
  }
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.module-header h2 {
  margin: 0;
  font-size: 20px;
}

.module-header p {
  margin: 6px 0 0;
  color: #64748b;
}

.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 8px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.btn.ghost {
  background: #e2e8f0;
  color: #1e293b;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.card {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
}

.chart {
  width: 100%;
  height: 140px;
}

.legend {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
}

.kpi-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.kpi-list strong {
  font-size: 18px;
  color: #1d4ed8;
}

.kpi-list span {
  display: block;
  color: #64748b;
  font-size: 12px;
}

.table-card {
  background: #f8fafc;
  padding: 16px;
  border-radius: 16px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.table-card table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

th,
td {
  padding: 10px 8px;
  text-align: left;
}

thead {
  background: #e2e8f0;
}

tbody tr:nth-child(even) {
  background: #ffffff;
}

.tag {
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.good {
  background: #dcfce7;
  color: #166534;
}

.tag.warn {
  background: #fee2e2;
  color: #b91c1c;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.form-grid label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #475569;
}

.form-grid input,
.form-grid select,
.form-grid textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
}

.form-grid .full {
  grid-column: 1 / -1;
}

.progress {
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
  margin: 12px 0;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #38bdf8, #2563eb);
  transition: width 0.2s ease;
}

.muted {
  color: #94a3b8;
  font-size: 12px;
}

.notice-list {
  padding-left: 18px;
  color: #475569;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.chips span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
</style>
