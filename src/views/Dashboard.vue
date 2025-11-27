<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">🔥 消防安全</div>
      <nav>
        <router-link to="/app/training" :class="linkClass('/app/training')">培训管理</router-link>
        <router-link to="/app/drill" :class="linkClass('/app/drill')">应急演练</router-link>
        <router-link to="/app/knowledge" :class="linkClass('/app/knowledge')">安全知识库</router-link>
        <router-link to="/app/personnel" :class="linkClass('/app/personnel')">人员考核</router-link>
        <router-link to="/app/analytics" :class="linkClass('/app/analytics')">数据统计</router-link>
      </nav>
      <button class="secondary-btn" style="width: 100%; margin-top: auto;" @click="exitConfirm = true">退出系统</button>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="tag">在线模式</p>
          <h2 style="margin: 4px 0 0;">消防安全培训与应急演练管理</h2>
        </div>
        <div class="top-actions">
          <button class="ghost-btn" @click="hintVisible = true">提示</button>
          <button class="primary-btn" @click="syncData">同步数据</button>
        </div>
      </header>
      <section class="module">
        <router-view />
      </section>
    </main>

    <div v-if="hintVisible" class="modal-backdrop" @click.self="hintVisible = false">
      <div class="modal-card">
        <h3>使用提示</h3>
        <p>左侧选择具体模块，所有功能以卡片展示，按钮均提供弹窗操作与进度提示。</p>
        <div class="flex-between" style="margin-top: 10px;">
          <button class="ghost-btn" @click="hintVisible = false">知道了</button>
        </div>
      </div>
    </div>

    <div v-if="syncing" class="modal-backdrop" @click.self="syncing = false">
      <div class="modal-card">
        <h3>同步执行中</h3>
        <p>正在从培训、演练、知识库和人员档案中拉取最新数据。</p>
        <div class="progress-bar" style="margin: 8px 0;">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <p style="font-weight: 700;">{{ progress }}%</p>
        <div class="flex-between" style="margin-top: 10px;">
          <button class="ghost-btn" @click="syncing = false">关闭</button>
        </div>
      </div>
    </div>

    <div v-if="exitConfirm" class="modal-backdrop" @click.self="exitConfirm = false">
      <div class="modal-card">
        <h3>确定退出？</h3>
        <p>退出后需重新登录，当前未保存的数据可能丢失。</p>
        <div class="flex-between" style="margin-top: 10px; gap: 10px;">
          <button class="ghost-btn" @click="exitConfirm = false">取消</button>
          <button class="secondary-btn" @click="exitSystem">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const hintVisible = ref(false);
const syncing = ref(false);
const progress = ref(0);
const exitConfirm = ref(false);

const linkClass = (path) =>
  computed(() => (route.path === path ? 'active' : ''));

const syncData = () => {
  syncing.value = true;
  progress.value = 20;
  setTimeout(() => {
    progress.value = 60;
    setTimeout(() => {
      progress.value = 100;
    }, 700);
  }, 700);
};

const exitSystem = () => {
  exitConfirm.value = false;
  router.replace('/');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
}

.sidebar {
  background: linear-gradient(180deg, #eef2ff, #f5f3ff);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 4px 0 18px rgba(99, 102, 241, 0.08);
}

.logo {
  font-weight: 900;
  font-size: 20px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  padding: 10px 12px;
  border-radius: 12px;
  font-weight: 700;
  color: #1f2937;
}

nav a.active {
  background: #6366f1;
  color: #fff;
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.2);
}

.content {
  padding: 18px;
}

.topbar {
  background: #fff;
  padding: 12px 16px;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(31, 41, 55, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.top-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.module {
  margin-top: 14px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .sidebar nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
