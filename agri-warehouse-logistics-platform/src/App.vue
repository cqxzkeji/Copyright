<template>
  <div class="app">
    <aside v-if="!isLogin" class="sidebar">
      <div class="brand">
        <div class="brand-logo">AG</div>
        <div>
          <h1>农产品仓储物流与供应管理平台</h1>
          <p>智慧供应链协同中心</p>
        </div>
      </div>
      <nav class="nav">
        <RouterLink to="/supplier-management" active-class="active">产地与供应主体管理</RouterLink>
        <RouterLink to="/warehouse-inventory" active-class="active">仓储库存与出入库管理</RouterLink>
        <RouterLink to="/logistics-dispatch" active-class="active">物流调度与运输协同</RouterLink>
        <RouterLink to="/supply-order" active-class="active">供应计划与订单协同</RouterLink>
        <RouterLink to="/data-analytics" active-class="active">数据分析与风险预警</RouterLink>
      </nav>
      <button class="ghost-btn logout" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <header v-if="!isLogin" class="topbar">
        <div>
          <h2>{{ pageTitle }}</h2>
          <p>亮色自适应布局 · 今日数据实时更新</p>
        </div>
        <div class="topbar-actions">
          <div class="chip">在线节点 128</div>
          <div class="chip">预警 3</div>
        </div>
      </header>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isLogin = computed(() => route.path === '/login');

const pageTitle = computed(() => {
  const map = {
    '/supplier-management': '产地与供应主体管理',
    '/warehouse-inventory': '仓储库存与出入库管理',
    '/logistics-dispatch': '物流调度与运输协同',
    '/supply-order': '供应计划与订单协同',
    '/data-analytics': '数据分析与风险预警'
  };
  return map[route.path] || '欢迎使用';
});

const logout = () => {
  localStorage.removeItem('agri-auth');
  router.push('/login');
};
</script>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  width: 260px;
  padding: 24px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-right: 1px solid #e6e9f2;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4c8bf5, #2f6fed);
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand h1 {
  font-size: 16px;
}

.brand p {
  font-size: 12px;
  color: #6b7280;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav a {
  padding: 10px 14px;
  border-radius: 10px;
  color: #344054;
  background: #f4f6fb;
}

.nav a.active {
  background: #e7efff;
  color: #2f6fed;
  font-weight: 600;
}

.logout {
  margin-top: auto;
}

.content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.topbar h2 {
  font-size: 22px;
}

.topbar p {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.chip {
  padding: 8px 12px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 6px 16px rgba(31, 42, 68, 0.08);
  font-size: 12px;
}

@media (max-width: 960px) {
  .app {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    overflow-x: auto;
  }

  .nav {
    flex-direction: row;
    gap: 8px;
    flex-wrap: wrap;
  }
}
</style>
