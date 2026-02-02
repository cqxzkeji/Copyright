<template>
  <div class="page">
    <div class="card">
      <div class="section-title">自适应调节指标</div>
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-title">模型精度提升</div>
          <div class="kpi-value">+6.8%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">资源利用率</div>
          <div class="kpi-value">82%</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-title">自适应周期</div>
          <div class="kpi-value">15 min</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">优化策略曲线</div>
      <div class="line-chart">
        <div v-for="point in trend" :key="point.label" class="line-point">
          <div class="line-label">{{ point.label }}</div>
          <div class="line-track">
            <div class="line-fill" :style="{ width: point.value + '%' }"></div>
          </div>
          <div class="line-value">{{ point.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">优化任务队列（20条）</div>
      <div class="action-row">
        <button class="btn primary" @click="openModal('tune')">触发参数调优</button>
        <button class="btn" @click="openModal('progress')">优化进度</button>
        <button class="btn ghost" @click="openModal('tip')">调优提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务</th>
            <th>场景</th>
            <th>策略</th>
            <th>状态</th>
            <th>收益</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.scene }}</td>
            <td>{{ row.strategy }}</td>
            <td><span class="badge" :class="row.statusClass">{{ row.status }}</span></td>
            <td>{{ row.benefit }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal === 'tune'" title="触发参数调优" @close="closeModal">
      <div class="form-grid">
        <label class="form-field">
          优化目标
          <select>
            <option>精度优先</option>
            <option>效率优先</option>
            <option>资源均衡</option>
          </select>
        </label>
        <label class="form-field">
          影响范围
          <select>
            <option>全局模型</option>
            <option>指定场景</option>
            <option>夜间批处理</option>
          </select>
        </label>
        <label class="form-field">
          资源上限
          <input placeholder="如：80%" />
        </label>
        <label class="form-field">
          通知人
          <input placeholder="如：优化负责人" />
        </label>
      </div>
      <template #actions>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">开始调优</button>
      </template>
    </Modal>

    <Modal v-if="activeModal === 'progress'" title="优化进度" @close="closeModal">
      <p>自适应算法正在重估 4 组权重参数。</p>
      <div class="progress-bar">
        <div class="progress-value" style="width: 58%"></div>
      </div>
      <p>预计剩余 3 分钟，CPU 占用 54%。</p>
    </Modal>

    <Modal v-if="activeModal === 'tip'" title="调优提示" @close="closeModal">
      <p>建议在低峰期执行大规模参数重训练，确保教学现场实时性。</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');

const trend = [
  { label: '7:00', value: 42 },
  { label: '9:00', value: 58 },
  { label: '11:00', value: 66 },
  { label: '13:00', value: 73 },
  { label: '15:00', value: 81 },
  { label: '17:00', value: 76 }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const status = index % 3 === 0 ? '优化中' : index % 3 === 1 ? '待执行' : '已完成';
  const statusClass = status === '优化中' ? 'orange' : status === '待执行' ? 'blue' : 'green';
  return {
    id: `OPT-${String(index + 1).padStart(3, '0')}`,
    scene: `教学场景 ${index + 1}`,
    strategy: index % 2 === 0 ? '权重校准' : '特征压缩',
    status,
    statusClass,
    benefit: `+${(1.2 + index * 0.2).toFixed(1)}%`
  };
});

const openModal = (name) => {
  activeModal.value = name;
};

const closeModal = () => {
  activeModal.value = '';
};
</script>

<style scoped>
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.kpi-card {
  background: #f5f7ff;
  padding: 16px;
  border-radius: 12px;
}

.kpi-title {
  font-size: 13px;
  color: #5f6e8e;
}

.kpi-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
}

.line-chart {
  display: grid;
  gap: 12px;
}

.line-point {
  display: grid;
  grid-template-columns: 80px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.line-track {
  height: 10px;
  background: #eef2f8;
  border-radius: 999px;
  overflow: hidden;
}

.line-fill {
  height: 100%;
  background: linear-gradient(90deg, #5f89ff, #7ad1ff);
}

.line-value {
  text-align: right;
  font-weight: 600;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
