<template>
  <div class="module">
    <header class="panel">
      <div>
        <h3>断口灰斑检测</h3>
        <p>对上传的断口影像进行多尺度灰斑识别与裂纹扩展分析</p>
      </div>
      <div class="flex gap">
        <button @click="pushAlert('算法热备已切换，GPU A/B 同时在线')">检测集群</button>
        <button @click="runBatch">批次检测</button>
      </div>
    </header>
    <div class="grid">
      <div class="card">
        <h4>灰斑分级分布</h4>
        <MiniChart :values="[12, 30, 20, 10, 6, 4, 2]" />
        <p>今日灰斑 III 级占比 24%</p>
      </div>
      <div class="card">
        <h4>裂纹扩展趋势</h4>
        <MiniChart :values="[10, 20, 35, 40, 55, 60, 72]" />
        <p>扩展速度预警阈值: 70 μm/h</p>
      </div>
    </div>
    <section class="actions">
      <button @click="showAction('灰斑定位', '完成子像素配准，定位偏差 0.08px')">灰斑定位</button>
      <button @click="showAction('裂纹骨架', '骨架提取完成，可视化已更新')">裂纹骨架</button>
      <button @click="showAction('AI 判级', '智能判级：III 级 2 处，II 级 5 处')">AI 判级</button>
    </section>
  </div>
  <BaseModal :show="alertModal" title="集群状态" @close="alertModal = false">
    <p>{{ alertMessage }}</p>
  </BaseModal>
  <BaseModal :show="batchModal" title="批次检测" @close="batchModal = false">
    <p>批次 {{ batchId }} 正在执行</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: batchProgress + '%' }"></div>
    </div>
    <p>{{ batchProgress }}%</p>
  </BaseModal>
  <BaseModal :show="actionModal" :title="actionTitle" @close="actionModal = false">
    <p>{{ actionDetail }}</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const alertModal = ref(false);
const alertMessage = ref('');
const batchModal = ref(false);
const batchProgress = ref(0);
const batchId = ref('');
const actionModal = ref(false);
const actionTitle = ref('');
const actionDetail = ref('');

const pushAlert = (text) => {
  alertMessage.value = text;
  alertModal.value = true;
};

const runBatch = () => {
  batchId.value = `CRK-${Math.floor(Math.random() * 900 + 100)}`;
  batchModal.value = true;
  batchProgress.value = 0;
  const timer = setInterval(() => {
    batchProgress.value += 15;
    if (batchProgress.value >= 100) {
      batchProgress.value = 100;
      clearInterval(timer);
    }
  }, 250);
};

const showAction = (title, detail) => {
  actionTitle.value = title;
  actionDetail.value = detail;
  actionModal.value = true;
};
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
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
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
