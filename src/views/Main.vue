<template>
  <div class="main-layout">
    <aside>
      <h2>功能模块</h2>
      <nav>
        <button
          v-for="item in menu"
          :key="item.route"
          :class="{ active: isActive(item.route) }"
          @click="go(item.route)"
        >
          {{ item.label }}
        </button>
      </nav>
      <div class="actions">
        <button @click="showProgressModal">系统加载进度</button>
        <button @click="showTipModal">最新公告</button>
      </div>
    </aside>
    <section class="content">
      <header>
        <div>
          <h1>沉浸式体验调度中心</h1>
          <p>统一调度 VR 非遗文化与冰雪旅游场景，实时监控运行效率。</p>
        </div>
        <div class="status">
          <span>在线终端：{{ terminals }}</span>
          <span>当前模式：{{ currentMode }}</span>
        </div>
      </header>
      <div class="module-window">
        <router-view />
      </div>
    </section>
    <BaseModal v-model="showModal" :title="modalTitle">
      <template v-if="modalType === 'progress'">
        <p>{{ modalContent }}</p>
        <div class="progress">
          <div class="bar" :style="{ width: progress + '%' }"></div>
        </div>
        <small>自动更新至 100%，用于演示部署速度。</small>
      </template>
      <template v-else>
        <p>{{ modalContent }}</p>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import BaseModal from '../components/BaseModal.vue';

const router = useRouter();
const route = useRoute();

const menu = [
  { label: '场景展示体验', route: '/main/scene' },
  { label: '资源采集建模', route: '/main/modeling' },
  { label: '交互学习体验', route: '/main/learning' },
  { label: '数据统计分析', route: '/main/analytics' },
  { label: '展示管理后台', route: '/main/management' }
];

const terminals = ref(42);
const currentMode = ref('联动演示模式');

const showModal = ref(false);
const modalTitle = ref('');
const modalContent = ref('');
const modalType = ref('info');
const progress = ref(0);
let timer;

const go = (target) => {
  router.push(target);
};

const isActive = (target) => route.path === target;

const showProgressModal = () => {
  modalTitle.value = '节点部署进度';
  modalContent.value = '雪域与非遗双场景资源正在同步加载...';
  modalType.value = 'progress';
  progress.value = 0;
  showModal.value = true;
  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    progress.value = Math.min(100, progress.value + 10);
    modalContent.value = `节点已完成 ${progress.value}% ，保持设备在线`; 
    if (progress.value === 100) {
      clearInterval(timer);
      modalContent.value = '全部场景就绪，可切换体验';
    }
  }, 500);
};

const showTipModal = () => {
  modalTitle.value = '系统公告';
  modalContent.value = '周末开放冰雪互动主题，记得同步最新资源包。';
  modalType.value = 'info';
  showModal.value = true;
};

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  background: linear-gradient(120deg, #edf2ff, #f8fbff);
}

aside {
  flex: 0 0 280px;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 24px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

nav button {
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  padding: 12px 16px;
  border-radius: 12px;
  text-align: left;
}

nav button.active {
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  color: #0f172a;
}

.actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.actions button {
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 10px 12px;
  border-radius: 12px;
  background: transparent;
  color: inherit;
}

.content {
  flex: 1 1 480px;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}

header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
}

.status {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 16px;
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.08);
}

.module-window {
  flex: 1;
  background: white;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.08);
  padding: 24px;
  display: flex;
}

.progress {
  width: 100%;
  height: 10px;
  background: #e2e8f0;
  border-radius: 999px;
  overflow: hidden;
}

.progress .bar {
  height: 100%;
  background: linear-gradient(120deg, #4c6ef5, #5ce1e6);
  transition: width 0.3s ease;
}

@media (max-width: 960px) {
  aside {
    flex: 1 1 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
