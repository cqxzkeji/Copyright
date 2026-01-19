<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <h2>质量溯源平台</h2>
        <span>Agri Traceability</span>
      </div>
      <nav>
        <RouterLink to="/main/origin" class="nav-item">产地与主体档案</RouterLink>
        <RouterLink to="/main/production" class="nav-item">生产过程记录</RouterLink>
        <RouterLink to="/main/inspection" class="nav-item">检测检验与批次</RouterLink>
        <RouterLink to="/main/logistics" class="nav-item">流通环节与物流</RouterLink>
        <RouterLink to="/main/analysis" class="nav-item">溯源展示与监管</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="ghost" @click="showLogout = true">退出登录</button>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <div>
          <h1>农业质量溯源管理系统</h1>
          <p>统一档案、全过程记录、检测溯源、物流追踪、监管分析</p>
        </div>
        <div class="user-info">
          <span>当前用户：管理员</span>
          <span class="badge">在线</span>
        </div>
      </header>
      <main class="module-container">
        <router-view />
      </main>
    </div>

    <BaseModal
      :show="showLogout"
      title="确认退出"
      width="420px"
      @close="showLogout = false"
      @confirm="handleLogout"
    >
      <p>退出后将返回登录界面，请确认是否继续退出。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseModal from "../components/BaseModal.vue";

const router = useRouter();
const showLogout = ref(false);

const handleLogout = () => {
  showLogout.value = false;
  router.push("/login");
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #0f172a;
  color: #e2e8f0;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand span {
  font-size: 12px;
  color: #94a3b8;
}

nav {
  display: grid;
  gap: 12px;
}

.nav-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #e2e8f0;
  background: rgba(148, 163, 184, 0.1);
}

.nav-item.router-link-active {
  background: #2563eb;
  color: #fff;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
}

.ghost {
  width: 100%;
  padding: 10px 12px;
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.4);
  color: #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
  gap: 20px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.topbar h1 {
  margin: 0 0 6px;
  font-size: 20px;
}

.topbar p {
  margin: 0;
  color: #64748b;
  font-size: 14px;
}

.user-info {
  display: grid;
  gap: 6px;
  text-align: right;
  font-size: 13px;
}

.badge {
  background: #dcfce7;
  color: #166534;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  align-self: end;
}

.module-container {
  flex: 1;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }

  nav {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    width: 100%;
  }

  .content {
    padding: 16px;
  }
}
</style>
