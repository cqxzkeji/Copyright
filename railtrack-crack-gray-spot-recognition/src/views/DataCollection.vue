<template>
  <div class="module">
    <section class="panel">
      <div>
        <h3>数据采集与预处理</h3>
        <p>实时采集轨旁传感器数据并执行缺陷去噪、归一化与切片</p>
      </div>
      <div class="flex gap">
        <button @click="showInfo('采集任务已上线，正在汇聚传感器原始波形')">采集状态</button>
        <button @click="triggerProgress('同步远程传感器…')">同步传感器</button>
      </div>
    </section>
    <section class="grid">
      <div class="card">
        <h4>批次流量</h4>
        <MiniChart :values="[50, 58, 62, 70, 90, 95, 110]" />
        <p>平均每分钟 110 个断口样本</p>
      </div>
      <div class="card">
        <h4>预处理耗时</h4>
        <MiniChart :values="[1.4, 1.3, 1.2, 1.25, 1.1, 1.05, 0.95]" />
        <p>单样本耗时 0.95s</p>
      </div>
    </section>
    <section class="actions">
      <button @click="startTask('清洗噪声', '完成 FIR+小波联合去噪')">执行清洗</button>
      <button @click="startTask('特征归一化', '电势/温度特征已统一尺度，偏差 <0.03')">特征归一化</button>
      <button @click="startTask('切片入库', '分片完成，已写入时间序列仓库')">切片入库</button>
    </section>
  </div>
  <BaseModal :show="infoModal" title="状态提示" @close="infoModal = false">
    <p>{{ infoContent }}</p>
  </BaseModal>
  <BaseModal :show="progressModal" title="进度追踪" @close="progressModal = false">
    <p>{{ progressTitle }}</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: progress + '%' }"></div>
    </div>
    <p>{{ progress }}%</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const infoModal = ref(false);
const infoContent = ref('');
const progressModal = ref(false);
const progress = ref(0);
const progressTitle = ref('');

const showInfo = (text) => {
  infoContent.value = text;
  infoModal.value = true;
};

const triggerProgress = (title) => {
  progressTitle.value = title;
  progressModal.value = true;
  progress.value = 0;
  const timer = setInterval(() => {
    progress.value += 20;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(timer);
    }
  }, 300);
};

const startTask = (task, result) => {
  triggerProgress(`${task}处理中`);
  setTimeout(() => {
    showInfo(result);
  }, 1800);
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.panel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.grid {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.grid .card {
  flex: 1;
  min-width: 240px;
}

.actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}
</style>
