<template>
  <section class="module">
    <div class="module-header">
      <div>
        <h2>在线监测与质量保障</h2>
        <p>实时状态监测、报警管理、质量记录追溯。</p>
      </div>
      <div class="actions">
        <button class="primary" @click="openModal('alert')">生成报警</button>
        <button class="ghost" @click="openModal('inspect')">发起在线检测</button>
        <button class="ghost" @click="openModal('trace')">质量追溯</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <h3>关键状态监测</h3>
        <div class="status-cards">
          <div v-for="item in statusCards" :key="item.label" class="status-card">
            <strong>{{ item.value }}</strong>
            <span>{{ item.label }}</span>
          </div>
        </div>
        <div class="trend">
          <div v-for="trend in trends" :key="trend.label" class="trend-item">
            <span>{{ trend.label }}</span>
            <div class="trend-bar">
              <div class="trend-fill" :style="{ width: trend.value + '%' }"></div>
            </div>
            <strong>{{ trend.value }}%</strong>
          </div>
        </div>
      </div>
      <div class="card">
        <h3>报警分布</h3>
        <div class="alert-list">
          <div v-for="alert in alerts" :key="alert.type" class="alert-item">
            <div>
              <strong>{{ alert.type }}</strong>
              <p>{{ alert.detail }}</p>
            </div>
            <span class="tag" :class="alert.level">{{ alert.count }} 起</span>
          </div>
        </div>
        <button class="primary" @click="openModal('resolve')">批量消警</button>
      </div>
    </div>

    <div class="card table-card">
      <div class="table-header">
        <h3>质量记录</h3>
        <button class="ghost" @click="openModal('export')">导出质量记录</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>记录编号</th>
              <th>检测点</th>
              <th>缺陷类型</th>
              <th>偏差</th>
              <th>处理建议</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in tableRows" :key="row.id">
              <td>{{ row.id }}</td>
              <td>{{ row.point }}</td>
              <td>{{ row.issue }}</td>
              <td>{{ row.offset }}</td>
              <td>{{ row.action }}</td>
              <td>{{ row.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Modal :show="modal.show" :title="modal.title" :onClose="closeModal">
      <div v-if="modal.type === 'alert'" class="form-grid">
        <label>
          报警类型
          <select v-model="form.alertType">
            <option>温度超限</option>
            <option>振动异常</option>
            <option>路径偏差</option>
          </select>
        </label>
        <label>
          影响设备
          <input v-model="form.device" type="text" />
        </label>
        <label>
          处理等级
          <select v-model="form.level">
            <option>紧急</option>
            <option>高</option>
            <option>中</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'inspect'" class="info-block">
        <p>在线检测已进入任务队列，检测传感器正在同步。</p>
        <div class="progress">
          <div class="progress-bar" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
      <div v-else-if="modal.type === 'trace'" class="form-grid">
        <label>
          批次号
          <input v-model="form.batch" type="text" />
        </label>
        <label>
          产品编号
          <input v-model="form.product" type="text" />
        </label>
        <label>
          追溯深度
          <select v-model="form.depth">
            <option>全流程</option>
            <option>关键工序</option>
            <option>仅质量记录</option>
          </select>
        </label>
      </div>
      <div v-else-if="modal.type === 'resolve'" class="info-block">
        <p>将对 8 条重复报警执行批量消警操作。</p>
        <ul>
          <li>涉及设备：切割台 A1、B3、C2。</li>
          <li>需记录消警原因与责任人。</li>
        </ul>
      </div>
      <div v-else class="info-block">
        <p>质量记录导出中，系统将生成带追溯码的 PDF。</p>
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

const statusCards = [
  { label: '在线设备', value: '8 台' },
  { label: '当班报警', value: '12 条' },
  { label: '质量拦截', value: '3 项' },
  { label: '平均合格率', value: '98.4%' }
];

const trends = [
  { label: '温度稳定度', value: 96 },
  { label: '振动合规度', value: 92 },
  { label: '路径偏差控制', value: 94 }
];

const alerts = [
  { type: '温度异常', detail: '主轴冷却压力不足', count: 5, level: 'high' },
  { type: '振动偏高', detail: 'X 轴高频波动', count: 3, level: 'mid' },
  { type: '路径偏移', detail: '轮廓边界超差', count: 4, level: 'low' }
];

const tableRows = Array.from({ length: 20 }, (_, index) => ({
  id: `QC-${(index + 1).toString().padStart(3, '0')}`,
  point: `检测点-${index + 1}`,
  issue: index % 4 === 0 ? '边缘毛刺' : '尺寸偏差',
  offset: `${(0.02 + index * 0.002).toFixed(3)} mm`,
  action: index % 3 === 0 ? '二次打磨' : '调整路径补偿',
  status: index % 2 === 0 ? '待复检' : '已记录'
}));

const modal = ref({
  show: false,
  type: 'alert',
  title: ''
});

const form = ref({
  alertType: '温度超限',
  device: '切割台 A1',
  level: '紧急',
  batch: 'BATCH-2409-03',
  product: 'PN-AX-2201',
  depth: '全流程'
});

const progress = ref(30);
const timer = ref(null);

const openModal = (type) => {
  modal.value.type = type;
  modal.value.show = true;
  modal.value.title =
    type === 'alert'
      ? '生成报警'
      : type === 'inspect'
      ? '发起在线检测'
      : type === 'trace'
      ? '质量追溯'
      : type === 'resolve'
      ? '批量消警'
      : '导出质量记录';
  if (['inspect', 'export'].includes(type)) {
    progress.value = 30;
    if (timer.value) clearInterval(timer.value);
    timer.value = setInterval(() => {
      progress.value = Math.min(progress.value + 12, 100);
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

.status-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.status-card {
  background: #f7f9ff;
  border-radius: 12px;
  padding: 12px;
  display: grid;
  gap: 4px;
}

.status-card span {
  color: var(--muted);
  font-size: 12px;
}

.trend {
  display: grid;
  gap: 10px;
}

.trend-item {
  display: grid;
  gap: 6px;
  font-size: 13px;
}

.trend-bar {
  background: #eef1f7;
  border-radius: 999px;
  height: 8px;
  overflow: hidden;
}

.trend-fill {
  height: 100%;
  background: linear-gradient(90deg, #2f6bff, #12b981);
}

.alert-list {
  display: grid;
  gap: 12px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f7f9ff;
  border-radius: 12px;
  padding: 10px 12px;
}

.alert-item p {
  color: var(--muted);
  font-size: 13px;
}

.tag {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tag.high {
  background: #ffe4e6;
  color: #be123c;
}

.tag.mid {
  background: #fef3c7;
  color: #b45309;
}

.tag.low {
  background: #e0f2fe;
  color: #0369a1;
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
