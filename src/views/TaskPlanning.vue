<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>任务编排与路径规划</h2>
        <p>支持图纸导入、路径生成、材料排版与工序编排。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('import')">导入图纸</button>
        <button class="ghost" @click="openModal('layout')">智能排版</button>
        <button class="ghost" @click="openModal('route')">生成路径</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>排版利用率</h3>
        <div class="circle-chart">
          <svg viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" class="track" />
            <circle cx="60" cy="60" r="52" class="progress" :style="{ strokeDashoffset: 327 - (327 * efficiency) / 100 }" />
          </svg>
          <div class="circle-center">
            <strong>{{ efficiency }}%</strong>
            <span>材料利用率</span>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>当前任务队列</h3>
        <div class="queue">
          <div v-for="item in queue" :key="item.id" class="queue-item">
            <div>
              <strong>{{ item.name }}</strong>
              <p>{{ item.material }}</p>
            </div>
            <span class="tag">{{ item.status }}</span>
          </div>
        </div>
        <button class="primary" @click="openModal('schedule')">发布任务计划</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <h3>图纸与路径清单</h3>
        <button class="ghost" @click="openModal('optimize')">路径优化建议</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>任务编号</th>
              <th>图纸名称</th>
              <th>材料</th>
              <th>板材尺寸</th>
              <th>路径长度</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.name }}</td>
              <td>{{ row.material }}</td>
              <td>{{ row.size }}</td>
              <td>{{ row.path }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" :onClose="closeModal">
      <div v-if="modal.type === 'import'" class="form-grid">
        <label>
          文件来源
          <select v-model="form.source">
            <option>本地上传</option>
            <option>PLM 版本库</option>
            <option>历史复用</option>
          </select>
        </label>
        <label>
          图纸名称
          <input v-model="form.drawing" type="text" />
        </label>
        <label>
          版本号
          <input v-model="form.version" type="text" />
        </label>
      </div>
      <div v-else-if="modal.type === 'layout'" class="info-block">
        <p>系统正在根据材料规格进行自动排版计算。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>预计剩余 {{ 100 - progress }}%</small>
      </div>
      <div v-else-if="modal.type === 'route'" class="info-block">
        <p>路径生成完成，发现 3 处潜在干涉点。</p>
        <ul>
          <li>复杂曲线段建议调整加工顺序。</li>
          <li>孔位 X-17 建议增加预钻。</li>
          <li>外框轮廓建议启用缓冲补偿。</li>
        </ul>
      </div>
      <div v-else-if="modal.type === 'schedule'" class="form-grid">
        <label>
          计划名称
          <input v-model="form.schedule" type="text" />
        </label>
        <label>
          投产批次
          <input v-model="form.batch" type="text" />
        </label>
        <label>
          优先级
          <select v-model="form.priority">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
      </div>
      <div v-else class="info-block">
        <p>路径优化建议如下：</p>
        <ol>
          <li>将同向直线段合并，可减少 4.2% 加工时间。</li>
          <li>使用嵌套切割策略，降低空行程 6.8%。</li>
          <li>启用自动刀具路径平滑，减少振动。</li>
        </ol>
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

const efficiency = 92;

const queue = [
  { id: 1, name: '机翼加强件', material: '钛合金 TA15', status: '排版完成' },
  { id: 2, name: '舱门框架', material: '铝合金 7075', status: '路径生成' },
  { id: 3, name: '支撑梁', material: '复合材料 T800', status: '待审核' }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `TP-${(index + 1).toString().padStart(3, '0')}`,
  name: `图纸-${index + 12}-A`,
  material: index % 2 === 0 ? '碳纤维' : '铝合金',
  size: `${1200 + index * 6} × ${800 + index * 4} mm`,
  path: `${(48 + index * 0.6).toFixed(1)} m`,
  status: index % 3 === 0 ? '待确认' : '可投产'
}));

const modal = ref({
  show: false,
  type: 'import',
  title: ''
});

const form = ref({
  source: '本地上传',
  drawing: 'Wing-Frame-2024',
  version: 'V3.2',
  schedule: '高精度批次 04',
  batch: '2024-09-B',
  priority: '高'
});

const progress = ref(35);
const timer = ref(null);

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
  modal.value.title =
    type === 'import'
      ? '导入图纸'
      : type === 'layout'
      ? '智能排版'
      : type === 'route'
      ? '路径生成提示'
      : type === 'schedule'
      ? '发布任务计划'
      : '路径优化建议';
  if (type === 'layout') {
    progress.value = 35;
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      progress.value = Math.min(progress.value + 8, 100);
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

.circle-chart {
  position: relative;
  width: 160px;
  height: 160px;
  margin: 0 auto;
}

.circle-chart svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.track {
  fill: none;
  stroke: #eef1f7;
  stroke-width: 12;
}

.progress {
  fill: none;
  stroke: var(--primary);
  stroke-width: 12;
  stroke-linecap: round;
  stroke-dasharray: 327;
  transition: stroke-dashoffset 0.4s ease;
}

.circle-center {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  text-align: center;
}

.queue {
  display: grid;
  gap: 12px;
}

.queue-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9ff;
  border-radius: 12px;
  padding: 10px 12px;
}

.queue-item p {
  color: var(--muted);
  font-size: 13px;
}

.tag {
  background: #e9f7f3;
  color: #11845e;
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
