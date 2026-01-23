<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">智建</div>
        <div>
          <div class="logo-title">验收归档平台</div>
          <div class="logo-sub">数字化资料管理</div>
        </div>
      </div>
      <nav class="menu">
        <router-link class="menu-item" to="/app/project">验收项目管理</router-link>
        <router-link class="menu-item" to="/app/acceptance">分部分项验收</router-link>
        <router-link class="menu-item" to="/app/collection">资料采集</router-link>
        <router-link class="menu-item" to="/app/archive">资料归档检索</router-link>
        <router-link class="menu-item" to="/app/statistics">统计报表</router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="badge">在线用户 18</div>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="page-title">智慧建筑分部分项验收资料数字化归档平台</div>
          <div class="page-sub">五大模块协同，实时掌握资料与验收进度</div>
        </div>
        <div class="topbar-actions">
          <button class="btn light" @click="openNotice">消息提醒</button>
          <button class="btn" @click="goLogin">退出登录</button>
        </div>
      </header>
      <section class="content-area">
        <router-view />
      </section>
    </main>
  </div>
  <AppModal :open="noticeOpen" title="系统消息" @close="noticeOpen = false" @confirm="noticeOpen = false">
    <div class="notice">
      今日共收到 5 条验收资料更新提醒，请在 17:30 前完成审核。
    </div>
  </AppModal>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import AppModal from "../components/AppModal.vue";

const noticeOpen = ref(false);
const router = useRouter();

const openNotice = () => {
  noticeOpen.value = true;
};

const goLogin = () => {
  router.push("/login");
};
</script>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 12px 0 28px rgba(15, 23, 42, 0.05);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #60a5fa, #34d399);
  display: grid;
  place-items: center;
  color: #ffffff;
  font-weight: 700;
}

.logo-title {
  font-size: 16px;
  font-weight: 600;
}

.logo-sub {
  font-size: 12px;
  color: #94a3b8;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 14px;
  color: #334155;
  background: #f8fafc;
}

.menu-item.router-link-active {
  background: #e0f2fe;
  color: #0284c7;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px 28px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
}

.page-sub {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

.topbar-actions {
  display: flex;
  gap: 10px;
}

.content-area {
  flex: 1;
}

@media (max-width: 960px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    flex: 1;
  }
}
</style>
