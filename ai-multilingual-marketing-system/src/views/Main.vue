<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span>AI.M</span>
        <small>Marketing Control</small>
      </div>
      <nav>
        <RouterLink to="/app/content-generation" active-class="active">多语种内容生成</RouterLink>
        <RouterLink to="/app/content-optimization" active-class="active">跨文化优化</RouterLink>
        <RouterLink to="/app/data-analytics" active-class="active">数据评估</RouterLink>
        <RouterLink to="/app/content-audit" active-class="active">智能审核</RouterLink>
        <RouterLink to="/app/content-management" active-class="active">发布管理</RouterLink>
      </nav>
    </aside>
    <main class="workspace">
      <header class="workspace-header">
        <div>
          <p class="eyebrow">AI 多语种营销作业平台</p>
          <h2>智能内容驾驶舱</h2>
        </div>
        <div class="actions">
          <button @click="openNotification">今日提示</button>
          <button class="ghost" @click="logout">安全退出</button>
        </div>
      </header>
      <section class="content-wrapper">
        <RouterView />
      </section>
    </main>
    <ModalDialog v-model="showHint" title="运营提醒">
      <p>各区域市场的广告法规正在更新，请确保内容在发布前完成合规复核。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter, RouterLink, RouterView } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showHint = ref(false);

const openNotification = () => {
  showHint.value = true;
};

const logout = () => {
  localStorage.removeItem('aims-auth');
  router.push('/login');
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: radial-gradient(circle at top left, rgba(56, 189, 248, 0.2), transparent 45%),
    var(--bg-dark);
}

.sidebar {
  width: 250px;
  background: rgba(15, 23, 42, 0.85);
  border-right: 1px solid rgba(148, 163, 184, 0.2);
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
}

.brand span {
  font-size: 1.8rem;
  font-weight: 700;
}

.brand small {
  display: block;
  color: var(--muted);
  margin-bottom: 24px;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

a {
  color: var(--muted);
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 14px;
  transition: background 0.2s, color 0.2s;
}

a.active,
nav a:hover {
  background: rgba(56, 189, 248, 0.15);
  color: var(--text);
}

.workspace {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 32px;
  gap: 24px;
}

.workspace-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(15, 23, 42, 0.6);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

.eyebrow {
  color: var(--muted);
  margin: 0;
}

.actions {
  display: flex;
  gap: 12px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 24px;
  font-weight: 600;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  color: #0f172a;
  cursor: pointer;
}

button.ghost {
  background: transparent;
  color: var(--muted);
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.content-wrapper {
  flex: 1;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 32px;
  padding: 32px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  overflow: auto;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    gap: 12px;
    overflow-x: auto;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
