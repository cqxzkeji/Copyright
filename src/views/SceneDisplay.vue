<template>
  <section class="panel">
    <header>
      <div>
        <h3>场景展示与体验</h3>
        <p>选择要展示的非遗场景，触发 VR 模式或大屏模式</p>
      </div>
      <button @click="showSceneTip = true">展示提示</button>
    </header>
    <div class="grid">
      <article v-for="scene in scenes" :key="scene.id" class="scene-card">
        <div class="scene-header">
          <h4>{{ scene.name }}</h4>
          <span>{{ scene.region }}</span>
        </div>
        <p>{{ scene.desc }}</p>
        <div class="actions">
          <button @click="launchScene(scene)">VR 演示</button>
          <button class="secondary" @click="openDetail(scene)">大屏播放</button>
        </div>
      </article>
    </div>
    <ModalDialog v-model="showSceneTip" title="展示操作提示">
      <p>VR 演示会立即同步至头显设备；大屏播放将推送至多媒体展墙并弹出投屏进度。</p>
    </ModalDialog>
    <ModalDialog v-model="selectedSceneModal" :title="currentScene?.name ?? '场景详情'">
      <p>{{ currentScene?.desc }}</p>
      <p>预计体验时长：{{ currentScene?.duration }} 分钟</p>
      <template #footer>
        <button class="primary" @click="selectedSceneModal = false">完成</button>
      </template>
    </ModalDialog>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import ModalDialog from '../components/ModalDialog.vue';

const showSceneTip = ref(false);
const selectedSceneModal = ref(false);
const currentScene = ref(null);

const scenes = [
  { id: 1, name: '黎族原生态织锦', region: '海南五指山', desc: '以 3D 扫描构建的织锦作坊，支持材质近距离观察。', duration: 6 },
  { id: 2, name: '侗族大歌夜会', region: '贵州从江', desc: '立体声场复刻侗寨鼓楼，360° 声音沉浸。', duration: 12 },
  { id: 3, name: '景德镇柴窑焙烧', region: '江西景德镇', desc: '通过 4K 立体视频再现柴窑点火全过程。', duration: 8 }
];

const launchScene = (scene) => {
  currentScene.value = scene;
  selectedSceneModal.value = true;
};

const openDetail = (scene) => {
  currentScene.value = scene;
  selectedSceneModal.value = true;
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

button {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 12px;
  background: #2563eb;
  color: white;
}

button.secondary {
  background: #e2e8f0;
  color: #0f172a;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.scene-card {
  border: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 16px;
}

.scene-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.actions {
  display: flex;
  gap: 0.6rem;
  margin-top: 1rem;
}
</style>
