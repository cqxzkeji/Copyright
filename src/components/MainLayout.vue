<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">L</div>
        <div>
          <p class="title">存量用地评估与更新</p>
          <p class="subtitle">决策支持系统</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/app/overview" class="menu-item" active-class="active">综合总览</router-link>
        <router-link to="/app/land-inventory" class="menu-item" active-class="active">基础数据管理</router-link>
        <router-link to="/app/value-assessment" class="menu-item" active-class="active">价值评估与潜力</router-link>
        <router-link to="/app/scenario-simulation" class="menu-item" active-class="active">情景模拟与比选</router-link>
        <router-link to="/app/decision-support" class="menu-item" active-class="active">决策支持排序</router-link>
        <router-link to="/app/result-visualization" class="menu-item" active-class="active">可视化与成果</router-link>
      </nav>
      <div class="sidebar-footer">
        <p>更新批次：2024 Q4</p>
        <p class="status">系统在线</p>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h2>城市存量用地更新决策平台</h2>
          <p>多源数据、评估、模拟与决策一体化</p>
        </div>
        <div class="top-actions">
          <button class="btn btn-outline" @click="toggleTip">快捷提示</button>
          <button class="btn btn-primary" @click="logout">退出登录</button>
        </div>
      </header>
      <router-view />
    </main>
    <BaseModal v-model="tipVisible" title="系统提示">
      <p>已进入主界面，左侧菜单可切换各功能模块，所有操作均通过弹窗完成。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import BaseModal from './BaseModal.vue';

const router = useRouter();
const tipVisible = ref(false);

const logout = () => {
  router.push('/login');
};

const toggleTip = () => {
  tipVisible.value = true;
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.title {
  margin: 0;
  font-weight: 700;
  font-size: 14px;
}

.subtitle {
  margin: 0;
  color: var(--muted);
  font-size: 12px;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--muted);
  font-weight: 600;
}

.menu-item.active {
  background: var(--primary-soft);
  color: var(--primary);
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: var(--muted);
}

.sidebar-footer .status {
  color: var(--accent);
  font-weight: 600;
}

.content {
  flex: 1;
  padding: 28px 32px 40px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.topbar h2 {
  margin: 0 0 6px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  color: var(--muted);
}

.top-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
