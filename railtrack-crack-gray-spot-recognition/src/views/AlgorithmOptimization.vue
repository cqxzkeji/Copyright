<template>
  <div class="module">
    <header class="panel">
      <div>
        <h3>算法优化与模型训练</h3>
        <p>针对灰斑识别网络执行参数搜索、蒸馏与在线微调</p>
      </div>
      <div class="flex gap">
        <button @click="openModal('自动调参', '当前正在遍历 32 组超参数组合')">超参搜索</button>
        <button @click="startTraining">启动训练</button>
      </div>
    </header>
    <section class="grid">
      <div class="card">
        <h4>损失下降趋势</h4>
        <MiniChart :values="[0.32, 0.3, 0.24, 0.21, 0.18, 0.15, 0.13]" />
        <p>当前最优损失 0.13</p>
      </div>
      <div class="card">
        <h4>准确率提升</h4>
        <MiniChart :values="[91, 92.4, 93, 94, 94.6, 95.1, 96]" />
        <p>蒸馏后精度 96%</p>
      </div>
    </section>
    <section class="actions">
      <button @click="openModal('结构剪枝', '剪枝率 30%，吞吐提升 1.4 倍')">结构剪枝</button>
      <button @click="openModal('知识蒸馏', '教师模型: Swin-L，学生模型: MobileNetV4')">知识蒸馏</button>
      <button @click="openModal('在线微调', '新增 1200 张样本已融入模型权重')">在线微调</button>
    </section>
  </div>
  <BaseModal :show="modal" :title="modalTitle" @close="modal = false">
    <p>{{ modalContent }}</p>
  </BaseModal>
  <BaseModal :show="trainingModal" title="训练进度" @close="trainingModal = false">
    <p>GPU 集群训练进行中…</p>
    <div class="progress-bar">
      <div class="progress-bar__inner" :style="{ width: trainingProgress + '%' }"></div>
    </div>
    <p>{{ trainingProgress }}%</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import MiniChart from '../components/MiniChart.vue';
import BaseModal from '../components/BaseModal.vue';

const modal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const trainingModal = ref(false);
const trainingProgress = ref(0);

const openModal = (title, content) => {
  modalTitle.value = title;
  modalContent.value = content;
  modal.value = true;
};

const startTraining = () => {
  trainingModal.value = true;
  trainingProgress.value = 0;
  const timer = setInterval(() => {
    trainingProgress.value += 12;
    if (trainingProgress.value >= 100) {
      trainingProgress.value = 100;
      clearInterval(timer);
      openModal('训练完成', '模型权重已更新至推理集群');
    }
  }, 300);
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
