<template>
  <div class="page">
    <div class="card">
      <div class="section-title">采集总览</div>
      <div class="summary-grid">
        <div class="summary-item">
          <div class="summary-label">今日采集批次</div>
          <div class="summary-value">12</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">同步延迟</div>
          <div class="summary-value">38ms</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">异常记录</div>
          <div class="summary-value">2</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">采集分布图</div>
      <div class="chart">
        <div v-for="item in chartData" :key="item.label" class="bar">
          <div class="bar-label">{{ item.label }}</div>
          <div class="bar-track">
            <div class="bar-value" :style="{ width: item.value + '%' }"></div>
          </div>
          <div class="bar-metric">{{ item.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">采集任务列表（20条）</div>
      <div class="action-row">
        <button class="btn primary" @click="openModal('create')">新增采集任务</button>
        <button class="btn" @click="openModal('sync')">同步状态</button>
        <button class="btn ghost" @click="openModal('tip')">采集提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>任务编号</th>
            <th>场景</th>
            <th>模态</th>
            <th>状态</th>
            <th>延迟</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id">
            <td>{{ row.id }}</td>
            <td>{{ row.scene }}</td>
            <td>{{ row.modalities }}</td>
            <td><span class="badge" :class="row.statusClass">{{ row.status }}</span></td>
            <td>{{ row.latency }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal === 'create'" title="新增采集任务" @close="closeModal">
      <div class="form-grid">
        <label class="form-field">
          场景名称
          <input placeholder="如：智慧课堂A" />
        </label>
        <label class="form-field">
          采集模态
          <select>
            <option>视频 + 音频</option>
            <option>视频 + 传感器</option>
            <option>音频 + 行为</option>
          </select>
        </label>
        <label class="form-field">
          同步策略
          <select>
            <option>时间戳对齐</option>
            <option>事件触发</option>
            <option>滑动窗口</option>
          </select>
        </label>
        <label class="form-field">
          备注
          <textarea rows="2" placeholder="补充采集说明"></textarea>
        </label>
      </div>
      <template #actions>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">确认创建</button>
      </template>
    </Modal>

    <Modal v-if="activeModal === 'sync'" title="实时同步进度" @close="closeModal">
      <p>当前正在同步 3 个教学场景的多模态数据流。</p>
      <div class="progress-bar" aria-label="同步进度">
        <div class="progress-value" style="width: 72%"></div>
      </div>
      <p>预计剩余 1 分 20 秒，网络通道稳定。</p>
    </Modal>

    <Modal v-if="activeModal === 'tip'" title="采集提示" @close="closeModal">
      <p>请确认传感器校准完成后再开启新任务，避免因时间戳漂移导致的数据对齐误差。</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');

const chartData = [
  { label: '视频', value: 78 },
  { label: '音频', value: 65 },
  { label: '传感器', value: 52 },
  { label: '行为轨迹', value: 71 }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const id = `COL-${String(index + 1).padStart(3, '0')}`;
  const statusOptions = [
    { label: '运行中', class: 'green' },
    { label: '排队中', class: 'blue' },
    { label: '需校准', class: 'orange' }
  ];
  const status = statusOptions[index % statusOptions.length];
  return {
    id,
    scene: `课堂 ${index + 1} 号`,
    modalities: index % 2 === 0 ? '视频 + 音频' : '视频 + 传感器',
    status: status.label,
    statusClass: status.class,
    latency: `${30 + index}ms`
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
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.summary-item {
  background: #f6f8fe;
  border-radius: 12px;
  padding: 14px;
}

.summary-label {
  font-size: 13px;
  color: #5c6c8b;
}

.summary-value {
  font-size: 22px;
  font-weight: 700;
  margin-top: 6px;
}

.chart {
  display: grid;
  gap: 12px;
}

.bar {
  display: grid;
  grid-template-columns: 120px 1fr 60px;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.bar-track {
  background: #eef2f8;
  border-radius: 999px;
  height: 10px;
  overflow: hidden;
}

.bar-value {
  height: 100%;
  background: linear-gradient(90deg, #4e7cf6, #5ec6ff);
}

.bar-metric {
  text-align: right;
  font-weight: 600;
  color: #3d558b;
}

.action-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
