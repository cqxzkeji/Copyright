<template>
  <section class="panel">
    <header>
      <div>
        <h3>资源采集与建模</h3>
        <p>管理实地采集任务、数据清洗与建模队列</p>
      </div>
      <button @click="openCaptureModal">启动采集</button>
    </header>
    <div class="tasks">
      <article v-for="task in tasks" :key="task.id">
        <div>
          <h4>{{ task.name }}</h4>
          <p>{{ task.desc }}</p>
        </div>
        <div class="meta">
          <span>{{ task.status }}</span>
          <button class="secondary" @click="queueModeling(task)">建模排队</button>
        </div>
      </article>
    </div>
    <ModalDialog v-model="captureModal" title="采集进度">
      <p>正在从 {{ captureLocation }} 采集纹理与点云，完成后自动上传。</p>
      <div class="progress large">
        <div class="progress-inner" :style="{ width: captureProgress + '%' }"></div>
      </div>
      <template #footer>
        <button class="primary" @click="captureModal = false">收起</button>
      </template>
    </ModalDialog>
    <ModalDialog v-model="queueModal" title="建模排队结果">
      <p>{{ modelingMessage }}</p>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const tasks = ref([
  { id: 1, name: '藏香制作手工坊', desc: '需要补拍火候控制环节', status: '待采集' },
  { id: 2, name: '苗族银饰锻造', desc: '已完成点云重建，等待贴图', status: '建模中' },
  { id: 3, name: '傣族泼水节巡游', desc: '同步 8K 全景视频，待剪辑', status: '素材上传中' }
]);

const captureModal = ref(false);
const queueModal = ref(false);
const captureProgress = ref(25);
const captureLocation = ref('拉萨色拉寺');
const modelingMessage = ref('');
let timer;

const openCaptureModal = () => {
  captureProgress.value = 25;
  captureModal.value = true;
  clearInterval(timer);
  timer = setInterval(() => {
    if (captureProgress.value >= 100) {
      clearInterval(timer);
      modelingMessage.value = `${captureLocation.value} 的素材已上传，可进行 AI 去噪。`;
      queueModal.value = true;
      return;
    }
    captureProgress.value += 10;
  }, 800);
};

const queueModeling = (task) => {
  modelingMessage.value = `${task.name} 已加入建模队列，预计 30 分钟出结果。`;
  queueModal.value = true;
};
</script>

<style scoped>
.panel {
  background: white;
  border-radius: 18px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.tasks article {
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: #0ea5e9;
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.progress {
  width: 100%;
  height: 12px;
  background: #e2e8f0;
  border-radius: 999px;
  margin: 1rem 0;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background: linear-gradient(90deg, #fbbf24, #ec4899);
}
</style>
