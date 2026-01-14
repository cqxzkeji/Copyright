<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="logo">VR 非遗系统</div>
      <nav class="menu">
        <RouterLink to="/app/scene" class="menu-item" active-class="active">场景展示</RouterLink>
        <RouterLink to="/app/modeling" class="menu-item" active-class="active">资源建模</RouterLink>
        <RouterLink to="/app/learning" class="menu-item" active-class="active">交互教学</RouterLink>
        <RouterLink to="/app/analytics" class="menu-item" active-class="active">数据分析</RouterLink>
        <RouterLink to="/app/management" class="menu-item" active-class="active">展示管理</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <span class="badge">在线</span>
        <span>heritage-admin</span>
      </div>
    </aside>
    <main class="main-area">
      <header class="topbar">
        <div>
          <div class="title">非遗文化场景再现与展示系统</div>
          <div class="subtitle">沉浸体验 · 资源采集 · 互动教学 · 数据洞察 · 展示管理</div>
        </div>
        <div class="topbar-actions">
          <button class="ghost-btn" @click="showNotice = true">系统公告</button>
          <button class="primary-btn" @click="onLogout">退出登录</button>
        </div>
      </header>
      <section class="content">
        <router-view />
      </section>
    </main>
    <BaseModal v-if="showNotice" title="系统公告" @close="showNotice = false" @confirm="showNotice = false">
      <p>当前系统正在进行资源整合升级，请关注最新内容发布。</p>
      <p>今日推荐：徽州砖雕、苗族银饰、景德镇陶瓷工艺。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const showNotice = ref(false);
const router = useRouter();

const onLogout = () => {
  router.push("/");
};
</script>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 28px 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 24px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  font-weight: 700;
  font-size: 20px;
}

.menu {
  display: grid;
  gap: 12px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f8fafc;
  color: #1f2937;
  font-weight: 600;
}

.menu-item.active {
  background: linear-gradient(135deg, #e0f2fe, #dbeafe);
  color: #2563eb;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #64748b;
}

.main-area {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.topbar {
  padding: 28px clamp(24px, 4vw, 40px);
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.title {
  font-size: 22px;
  font-weight: 700;
}

.subtitle {
  color: #64748b;
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.content {
  padding: 28px clamp(24px, 4vw, 40px) 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

@media (max-width: 960px) {
  .app-shell {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    height: auto;
    grid-template-columns: 1fr;
  }
}
</style>
