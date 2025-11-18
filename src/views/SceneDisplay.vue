<template>
  <div class="module scene">
    <div class="intro">
      <div>
        <h2>场景展示与沉浸体验</h2>
        <p>通过多维度视角预览非遗文化街区与冰雪旅游线路，实现跨场景联动演示。</p>
      </div>
      <button class="primary" @click="openModal('正在推送高清 VR 资源流，预计 8 秒完成。')">推送高清流</button>
    </div>
    <div class="cards">
      <article v-for="scene in scenes" :key="scene.id">
        <header>
          <h3>{{ scene.name }}</h3>
          <span>{{ scene.temperature }}</span>
        </header>
        <p>{{ scene.desc }}</p>
        <footer>
          <button @click="openModal(`${scene.name} 已切换为沉浸模式。`)">进入体验</button>
          <button @click="startProgress(scene.name)">调整渲染</button>
        </footer>
      </article>
    </div>
    <BaseModal v-model="showModal" title="场景提示">
      <template v-if="modalType === 'progress'">
        <p>{{ modalMessage }}</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
      </template>
      <template v-else>
        <p>{{ modalMessage }}</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const scenes = [
  { id: 1, name: '敦煌壁画复刻', temperature: '恒温 22℃', desc: '360° 恢复壁画纹理与光影，支持笔刷讲解。' },
  { id: 2, name: '冰湖极光之旅', temperature: '-12℃ 体感', desc: '极光天气联动语音讲解，可调节风雪强度。' },
  { id: 3, name: '苗寨鼓舞集会', temperature: '舒适 25℃', desc: '可触发表演动画，配套民族乐器互动。' }
];

const showModal = ref(false);
const modalMessage = ref('');
const modalType = ref('info');
const progress = ref(0);
let timer;

const openModal = (msg) => {
  modalType.value = 'info';
  modalMessage.value = msg;
  showModal.value = true;
};

const startProgress = (sceneName) => {
  modalType.value = 'progress';
  modalMessage.value = `${sceneName} 渲染参数校准中...`;
  progress.value = 0;
  showModal.value = true;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 20);
    if (progress.value === 100) {
      clearInterval(timer);
      modalType.value = 'info';
      modalMessage.value = `${sceneName} 渲染优化完成！`;
    }
  }, 400);
};

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.module {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
}

.intro {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.primary {
  border: none;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

article {
  flex: 1 1 260px;
  border: 1px solid #edf2ff;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

article header {
  display: flex;
  justify-content: space-between;
}

footer {
  display: flex;
  gap: 12px;
}

footer button {
  flex: 1;
  border-radius: 12px;
  border: 1px solid #cbd5f5;
  padding: 10px;
}

.progress {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress .bar {
  height: 100%;
  background: linear-gradient(120deg, #5ce1e6, #4c6ef5);
  transition: width 0.3s ease;
}
</style>
