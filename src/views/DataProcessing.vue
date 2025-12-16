<template>
  <section class="grid" style="gap: 16px;">
    <div class="card" style="padding: 16px; display: grid; gap: 12px;">
      <div class="topbar">
        <div>
          <h3 style="font-size: 18px;">特征提取与预处理</h3>
          <p style="color: var(--muted); font-size: 14px;">对采集流量进行切片、向量化、标准化，按钮均弹窗展示配置或进度。</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button @click="openModal('pipeline')">启动特征管道</button>
          <button style="background: #eab308;" @click="openModal('quality')">质量检测</button>
          <button style="background: #22c55e;" @click="openModal('train')">模型训练</button>
        </div>
      </div>
      <div style="display: grid; gap: 8px; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));">
        <div class="card" style="padding: 12px;">
          <div class="label">当前模型</div>
          <div style="font-weight: 700; font-size: 22px;">Gradient Boosting</div>
          <p style="color: var(--muted); font-size: 13px;">准确率 96.2%</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">特征维度</div>
          <div style="font-weight: 700; font-size: 22px;">128</div>
          <p style="color: var(--muted); font-size: 13px;">最近一次归一化成功</p>
        </div>
        <div class="card" style="padding: 12px;">
          <div class="label">异常分布</div>
          <div style="font-weight: 700; font-size: 22px;">{{ riskRate }}%</div>
          <p style="color: var(--muted); font-size: 13px;">基于熵值分布</p>
        </div>
      </div>
    </div>

    <DataTable
      title="特征向量概览"
      subtitle="10 条样本，展示异常分值"
      :columns="columns"
      :rows="featureVectors"
    >
      <template #cell-anomalyScore="{ value }">
        <span class="badge" :class="Number(value) > 60 ? 'danger' : 'warning'">{{ value }}</span>
      </template>
      <template #actions>
        <button style="background: #e2e8f0; color: #0f172a;" @click="openModal('export')">导出样本</button>
      </template>
    </DataTable>

    <TrendChart title="恶意流量特征热度" subtitle="按特征类型展示贡献度" :series="heatSeries">
      <template #actions>
        <button @click="openModal('feature')">调整特征权重</button>
      </template>
    </TrendChart>
  </section>

  <ModalDialog v-model="visible" :title="modalTitle" @confirm="confirmAction">
    <div v-if="activeAction === 'feature' || activeAction === 'pipeline'" class="grid" style="gap: 10px;">
      <label class="grid">
        <span class="label">特征权重策略</span>
        <select class="select" v-model="form.strategy">
          <option value="chi-square">卡方检验</option>
          <option value="gain">信息增益</option>
          <option value="mutual">互信息</option>
        </select>
      </label>
      <label class="grid">
        <span class="label">批大小</span>
        <input class="input" type="number" v-model.number="form.batch" min="32" />
      </label>
    </div>
    <div v-else-if="activeAction === 'train'" class="grid" style="gap: 10px;">
      <p style="color: var(--muted);">正在触发模型训练，进度弹窗实时展示。</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="color: var(--muted);">训练完成度：{{ progress }}%</div>
    </div>
    <div v-else class="grid" style="gap: 10px;">
      <p style="color: var(--muted);">将导出特征样本或进行质量检测，操作均为 modal。</p>
      <div class="progress-track">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <div style="color: var(--muted);">任务进度：{{ progress }}%</div>
    </div>
  </ModalDialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import DataTable from '../components/DataTable.vue';
import TrendChart from '../components/TrendChart.vue';
import ModalDialog from '../components/ModalDialog.vue';
import { featureVectors } from '../services/mockData.js';
import { randomPercent } from '../utils/format.js';

const columns = [
  { key: 'name', label: '特征名称' },
  { key: 'entropy', label: '熵值' },
  { key: 'flowCount', label: '覆盖流量' },
  { key: 'anomalyScore', label: '异常分值' }
];

const heatSeries = [
  { label: '序列长度', value: 82 },
  { label: '字节分布', value: 71 },
  { label: '包间隔', value: 64 },
  { label: '协议指纹', value: 58 },
  { label: 'TLS JA3', value: 45 }
];

const riskRate = computed(() => 42 + Math.round(Math.random() * 15));

const visible = ref(false);
const activeAction = ref('');
const progress = ref(0);
const form = reactive({ strategy: 'gain', batch: 128 });

const modalTitle = computed(() => {
  const map = {
    pipeline: '启动特征管道',
    quality: '质量检测',
    train: '模型训练',
    export: '导出样本',
    feature: '调整特征权重'
  };
  return map[activeAction.value] || '操作';
});

const openModal = (action) => {
  activeAction.value = action;
  progress.value = randomPercent();
  visible.value = true;
};

const confirmAction = () => {
  progress.value = 100;
  setTimeout(() => (visible.value = false), 600);
};
</script>
