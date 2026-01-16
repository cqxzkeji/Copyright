<template>
  <div class="module">
    <div class="module-header">
      <div>
        <h2>生产计划与工单调度管理</h2>
        <p>自动生成成型—打磨联动计划，支持拆分与优先级调整。</p>
      </div>
      <div class="actions">
        <button class="btn" type="button" @click="openGenerate">生成计划</button>
        <button class="btn ghost" type="button" @click="openWorkOrder">新增工单</button>
        <button class="btn ghost" type="button" @click="openPriority">优先级调整</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>计划节拍趋势</h3>
        <svg viewBox="0 0 320 140" class="chart">
          <rect v-for="(bar, index) in bars" :key="index" :x="bar.x" :y="bar.y" :width="bar.w" :height="bar.h" fill="#60a5fa" />
        </svg>
        <div class="legend">
          <span v-for="label in ['周一', '周二', '周三', '周四', '周五', '周六']" :key="label">{{ label }}</span>
        </div>
      </div>
      <div class="card">
        <h3>计划指标</h3>
        <div class="kpi-list">
          <div>
            <strong>18 单</strong>
            <span>今日工单</span>
          </div>
          <div>
            <strong>4 单</strong>
            <span>紧急订单</span>
          </div>
          <div>
            <strong>6.5 小时</strong>
            <span>排产时长</span>
          </div>
          <div>
            <strong>3 条线</strong>
            <span>联动产线</span>
          </div>
        </div>
      </div>
    </div>

    <div class="table-card">
      <div class="table-header">
        <h3>生产工单列表</h3>
        <button class="btn ghost" type="button" @click="openSplit">工单拆分</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>工单号</th>
            <th>批次</th>
            <th>产品型号</th>
            <th>数量</th>
            <th>计划开始</th>
            <th>计划完成</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.order }}</td>
            <td>{{ row.batch }}</td>
            <td>{{ row.model }}</td>
            <td>{{ row.qty }}</td>
            <td>{{ row.start }}</td>
            <td>{{ row.end }}</td>
            <td><span :class="['tag', row.statusClass]">{{ row.status }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal :open="generateModal" title="计划生成进度" @close="generateModal = false">
      <p>正在匹配订单需求、产能约束与设备可用性。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: `${generateProgress}%` }"></div>
      </div>
      <p class="muted">已完成 {{ generateProgress }}%，预计减少切换 12%。</p>
    </Modal>

    <Modal :open="workOrderModal" title="新增工单" confirm-text="保存工单" @close="workOrderModal = false" @confirm="workOrderModal = false">
      <div class="form-grid">
        <label>
          订单编号
          <input v-model="workOrder.code" type="text" />
        </label>
        <label>
          产品型号
          <input v-model="workOrder.model" type="text" />
        </label>
        <label>
          计划数量
          <input v-model="workOrder.qty" type="number" />
        </label>
        <label>
          交期
          <input v-model="workOrder.due" type="date" />
        </label>
        <label class="full">
          备注
          <textarea v-model="workOrder.note" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="priorityModal" title="优先级调整" confirm-text="确认调整" @close="priorityModal = false" @confirm="priorityModal = false">
      <div class="form-grid">
        <label>
          目标工单
          <input v-model="priority.order" type="text" />
        </label>
        <label>
          新优先级
          <select v-model="priority.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label class="full">
          调整原因
          <textarea v-model="priority.reason" rows="2"></textarea>
        </label>
      </div>
    </Modal>

    <Modal :open="splitModal" title="工单拆分" confirm-text="生成子工单" @close="splitModal = false" @confirm="splitModal = false">
      <p>将 SN-2024-082 拆分为成型与打磨两个子工单。</p>
      <div class="chips">
        <span>子工单 A：成型 620 件</span>
        <span>子工单 B：打磨 620 件</span>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watchEffect } from 'vue';
import Modal from '../components/Modal.vue';

const generateModal = ref(false);
const workOrderModal = ref(false);
const priorityModal = ref(false);
const splitModal = ref(false);
const generateProgress = ref(0);
let generateTimer;

const workOrder = reactive({
  code: 'WO-2024-120',
  model: 'SB-Connector-X',
  qty: 620,
  due: '2024-09-18',
  note: '与急单 SN-2024-082 联动排产。'
});

const priority = reactive({
  order: 'WO-2024-114',
  level: '高',
  reason: '客户急单，需提前交付。'
});

const rows = computed(() =>
  Array.from({ length: 21 }, (_, index) => {
    const id = index + 1;
    return {
      id,
      order: `WO-2024-${String(100 + id).padStart(3, '0')}`,
      batch: `SN-2024-${String(60 + id).padStart(3, '0')}`,
      model: id % 2 === 0 ? 'SB-Connector-A' : 'SB-Connector-B',
      qty: 480 + (id % 4) * 80,
      start: `09:${String((id * 3) % 60).padStart(2, '0')}`,
      end: `11:${String((id * 5) % 60).padStart(2, '0')}`,
      status: id % 4 === 0 ? '待排产' : '执行中',
      statusClass: id % 4 === 0 ? 'warn' : 'good'
    };
  })
);

const bars = [
  { x: 14, y: 40, w: 30, h: 80 },
  { x: 64, y: 20, w: 30, h: 100 },
  { x: 114, y: 50, w: 30, h: 70 },
  { x: 164, y: 30, w: 30, h: 90 },
  { x: 214, y: 60, w: 30, h: 60 },
  { x: 264, y: 45, w: 30, h: 75 }
];

const openGenerate = () => {
  generateModal.value = true;
};

const openWorkOrder = () => {
  workOrderModal.value = true;
};

const openPriority = () => {
  priorityModal.value = true;
};

const openSplit = () => {
  splitModal.value = true;
};

watchEffect(() => {
  if (generateModal.value) {
    generateProgress.value = 0;
    generateTimer = setInterval(() => {
      generateProgress.value = Math.min(generateProgress.value + 9, 100);
      if (generateProgress.value === 100) {
        clearInterval(generateTimer);
      }
    }, 200);
  } else if (generateTimer) {
    clearInterval(generateTimer);
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

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.chips span {
  background: #dbeafe;
  color: #1d4ed8;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
}
</style>
