<template>
  <div class="module-shell">
    <section class="module-header">
      <div>
        <h2>运维支持与故障诊断</h2>
        <p>统一记录巡检计划、健康评估和智能诊断建议。</p>
      </div>
      <div class="header-btns">
        <button class="secondary-btn" @click="openModal('巡检提醒', '边界补给站需在 2 小时内完成巡检。')">巡检提醒</button>
        <button class="primary-btn" @click="runDiagnosis">启动诊断</button>
      </div>
    </section>

    <div class="card-grid">
      <div class="card" v-for="task in tasks" :key="task.id">
        <div class="task-header">
          <h3>{{ task.name }}</h3>
          <span class="tag">{{ task.status }}</span>
        </div>
        <p>{{ task.detail }}</p>
        <div class="task-actions">
          <button class="secondary-btn" @click="updateTask(task.id, '完成')">标记完成</button>
          <button class="secondary-btn" @click="openModal(task.name, task.detail)">详情</button>
        </div>
      </div>
    </div>

    <div class="timeline">
      <h3>诊断时间线</h3>
      <ul>
        <li v-for="log in timeline" :key="log.time">
          <div>
            <strong>{{ log.time }}</strong>
            <p>{{ log.event }}</p>
          </div>
          <button class="secondary-btn" @click="openModal('操作记录', log.event)">查看</button>
        </li>
      </ul>
    </div>

    <BaseModal v-if="modal" :title="modal.title" @close="modal = null">
      {{ modal.message }}
    </BaseModal>

    <BaseModal v-if="showProgress" title="诊断执行">
      <p>诊断完成度 {{ progress }}%，请等待 AI 分析结果。</p>
      <div class="progress-shell">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const tasks = ref([
  { id: 1, name: '液压系统巡检', status: '排期', detail: '检测执行臂液压压力，校验泄压阀。' },
  { id: 2, name: '光学传感标定', status: '进行中', detail: '多光谱通道标定并上传参数。' },
  { id: 3, name: '动力模块检修', status: '排期', detail: '更换磨损部件，执行震动分析。' }
]);

const timeline = ref([
  { time: '09:45', event: '北区中继站完成固件升级' },
  { time: '10:20', event: '南域无人艇提交诊断包' },
  { time: '11:05', event: '能源站负载预测完成校准' }
]);

const modal = ref(null);
const showProgress = ref(false);
const progress = ref(0);
let timer;

const openModal = (title, message) => {
  modal.value = { title, message };
};

const updateTask = (id, status) => {
  tasks.value = tasks.value.map((task) => (task.id === id ? { ...task, status } : task));
  openModal('状态更新', '任务状态已记录到运维日志。');
};

const runDiagnosis = () => {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(timer);
  timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      setTimeout(() => (showProgress.value = false), 600);
      openModal('诊断完成', 'AI 建议：更换能源站滤芯并复核通信模块。');
    } else {
      progress.value += 15;
    }
  }, 400);
};
</script>

<style scoped>
.module-shell {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.timeline {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 1.25rem;
}

.timeline ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.timeline li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 0.75rem;
  border-bottom: 1px dashed rgba(255, 255, 255, 0.08);
}

.timeline li:last-child {
  border-bottom: none;
}
</style>
