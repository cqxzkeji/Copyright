<template>
  <div class="page">
    <div class="card">
      <div class="section-title">融合策略面板</div>
      <div class="strategy-grid">
        <div class="strategy-card">
          <div class="strategy-title">对齐策略</div>
          <p>基于时间戳与语义锚点联合对齐。</p>
          <div class="badge blue">启用</div>
        </div>
        <div class="strategy-card">
          <div class="strategy-title">权重融合</div>
          <p>自适应分配视频、音频、行为权重。</p>
          <div class="badge green">稳定</div>
        </div>
        <div class="strategy-card">
          <div class="strategy-title">异常检测</div>
          <p>融合后结果进行一致性校验。</p>
          <div class="badge orange">关注</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">融合关联热度</div>
      <div class="heatmap">
        <div v-for="item in heatmap" :key="item.label" class="heatmap-item">
          <div class="heatmap-label">{{ item.label }}</div>
          <div class="heatmap-bar">
            <div class="heatmap-fill" :style="{ width: item.value + '%' }"></div>
          </div>
          <div class="heatmap-value">{{ item.value }}%</div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="section-title">融合批次结果（20条）</div>
      <div class="action-row">
        <button class="btn primary" @click="openModal('plan')">新建融合方案</button>
        <button class="btn" @click="openModal('progress')">融合进度</button>
        <button class="btn ghost" @click="openModal('tip')">结果提示</button>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>批次</th>
            <th>模型</th>
            <th>融合得分</th>
            <th>一致性</th>
            <th>输出</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.batch">
            <td>{{ row.batch }}</td>
            <td>{{ row.model }}</td>
            <td>{{ row.score }}</td>
            <td><span class="badge" :class="row.statusClass">{{ row.status }}</span></td>
            <td>{{ row.output }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Modal v-if="activeModal === 'plan'" title="新建融合方案" @close="closeModal">
      <div class="form-grid">
        <label class="form-field">
          方案名称
          <input placeholder="如：课堂注意力融合V2" />
        </label>
        <label class="form-field">
          模型选择
          <select>
            <option>Transformer 融合</option>
            <option>多模态对比学习</option>
            <option>时序图神经网络</option>
          </select>
        </label>
        <label class="form-field">
          权重策略
          <select>
            <option>动态权重</option>
            <option>均衡权重</option>
            <option>教师权重</option>
          </select>
        </label>
        <label class="form-field">
          输出指标
          <input placeholder="如：注意力指数" />
        </label>
      </div>
      <template #actions>
        <button class="btn ghost" type="button" @click="closeModal">取消</button>
        <button class="btn primary" type="button" @click="closeModal">保存方案</button>
      </template>
    </Modal>

    <Modal v-if="activeModal === 'progress'" title="融合处理进度" @close="closeModal">
      <p>正在处理 5 个融合批次，GPU 负载 68%。</p>
      <div class="progress-bar">
        <div class="progress-value" style="width: 64%"></div>
      </div>
      <p>预计 2 分钟后输出完整结果。</p>
    </Modal>

    <Modal v-if="activeModal === 'tip'" title="结果提示" @close="closeModal">
      <p>融合得分低于 0.75 的批次建议重新校验音频噪声和行为标签。</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Modal from '../components/Modal.vue';

const activeModal = ref('');

const heatmap = [
  { label: '视频 ↔ 音频', value: 82 },
  { label: '视频 ↔ 行为', value: 76 },
  { label: '音频 ↔ 行为', value: 69 },
  { label: '传感器 ↔ 行为', value: 61 }
];

const rows = Array.from({ length: 20 }, (_, index) => {
  const score = (0.72 + index * 0.01).toFixed(2);
  const status = index % 3 === 0 ? '稳定' : index % 3 === 1 ? '需复核' : '高一致';
  const statusClass = status === '稳定' ? 'blue' : status === '需复核' ? 'orange' : 'green';
  return {
    batch: `FUS-${String(index + 1).padStart(3, '0')}`,
    model: index % 2 === 0 ? 'Transformer' : '时序融合网',
    score,
    status,
    statusClass,
    output: `${(88 + index).toFixed(1)} 分`
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
.strategy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.strategy-card {
  background: #f6f9ff;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 8px;
}

.strategy-title {
  font-weight: 600;
}

.heatmap {
  display: grid;
  gap: 12px;
}

.heatmap-item {
  display: grid;
  grid-template-columns: 140px 1fr 60px;
  align-items: center;
  gap: 12px;
}

.heatmap-bar {
  height: 10px;
  background: #eef2f8;
  border-radius: 999px;
  overflow: hidden;
}

.heatmap-fill {
  height: 100%;
  background: linear-gradient(90deg, #6c7cff, #84d8ff);
}

.heatmap-value {
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
