<template>
  <div class="module-grid">
    <div class="flat-card" style="grid-column: span 2">
      <header class="section-header">
        <div>
          <h3>VR 资源采集排程</h3>
          <p>按班次安排采集小队、无人机与传感器</p>
        </div>
        <button class="primary-btn" @click="openPlanModal">生成采集计划</button>
      </header>
      <div class="schedule">
        <div v-for="slot in schedule" :key="slot.team" class="schedule-item">
          <div>
            <strong>{{ slot.team }}</strong>
            <p>{{ slot.area }}</p>
          </div>
          <div class="badge">
            <span>{{ slot.device }}</span>
            <span>{{ slot.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>实时建模进度</h3>
          <p>点云数据合成 + 区域贴图</p>
        </div>
        <button class="secondary-btn" @click="simulateModeling">刷新</button>
      </header>
      <div class="progress-container">
        <div class="progress-bar" :style="{ width: modelingProgress + '%' }"></div>
      </div>
      <p class="progress-label">{{ modelingProgress }}% 已完成</p>
    </div>

    <div class="flat-card">
      <header class="section-header">
        <div>
          <h3>传感器分布</h3>
          <p>强度越高代表当前在线传感器数量越多</p>
        </div>
      </header>
      <div class="chart-placeholder">
        <div v-for="bar in bars" :key="bar" class="chart-bar" :style="{ height: bar + '%' }"></div>
      </div>
    </div>
  </div>
  <BaseModal v-if="modalVisible" title="采集计划" @close="modalVisible = false">
    <p>采集计划已生成并同步至 VR 场景，预计 18:30 完成采集。</p>
  </BaseModal>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const schedule = [
  { team: '东区 A 班', area: '暂存库入库口', device: '无人机', time: '08:00-10:00' },
  { team: '南区 B 班', area: '堆场二号', device: 'Lidar 小车', time: '10:30-12:00' },
  { team: '夜巡', area: '焚烧车间', device: '传感器阵列', time: '22:00-01:00' }
];
const bars = [60, 80, 45, 70, 55];
const modelingProgress = ref(68);
const modalVisible = ref(false);

const openPlanModal = () => {
  modalVisible.value = true;
};

const simulateModeling = () => {
  modelingProgress.value = Math.min(100, modelingProgress.value + 8);
};
</script>

<style scoped>
.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.schedule {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.schedule-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  border-radius: 14px;
  background: #f8fafc;
}

.progress-label {
  margin-top: 12px;
  color: #475467;
}
</style>
