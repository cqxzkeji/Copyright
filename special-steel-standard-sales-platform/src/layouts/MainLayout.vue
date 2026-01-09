<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">SS</div>
        <div>
          <h1>优特钢管控平台</h1>
          <p>标准 · 销售 · 协同</p>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/app/dashboard" class="menu-item">综合总览</router-link>
        <router-link to="/app/standard" class="menu-item">标准制定管理</router-link>
        <router-link to="/app/demand" class="menu-item">销售需求匹配</router-link>
        <router-link to="/app/quotation" class="menu-item">报价订单协同</router-link>
        <router-link to="/app/process" class="menu-item">流程协同审批</router-link>
        <router-link to="/app/analysis" class="menu-item">数据分析决策</router-link>
      </nav>
      <button class="ghost-button" type="button" @click="openTip('系统支持多角色协同，建议及时更新标准库。')">
        今日提示
      </button>
    </aside>
    <div class="main">
      <header class="topbar">
        <div>
          <h2>{{ pageTitle }}</h2>
          <span>标准驱动 · 销售联动 · 数据决策</span>
        </div>
        <div class="topbar-actions">
          <button class="secondary" type="button" @click="openTip('当前版本：V1.0 · 数据实时刷新')">版本说明</button>
          <button class="primary" type="button" @click="logoutVisible = true">退出登录</button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
    <Modal :show="logoutVisible" title="退出登录确认" @close="logoutVisible = false">
      <p>确认退出当前账号？未提交的信息将保留在草稿中。</p>
      <template #footer>
        <button class="ghost" type="button" @click="logoutVisible = false">取消</button>
        <button class="primary" type="button" @click="confirmLogout">确认退出</button>
      </template>
    </Modal>
    <Modal :show="tipVisible" title="系统提示" @close="tipVisible = false">
      <p>{{ tipMessage }}</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Modal from '../components/Modal.vue';

const route = useRoute();
const router = useRouter();

const logoutVisible = ref(false);
const tipVisible = ref(false);
const tipMessage = ref('');

const titles = {
  Dashboard: '综合总览与数据看板',
  StandardManage: '标准制定与版本管理',
  DemandMatch: '销售需求驱动与标准匹配',
  QuotationOrder: '报价与订单协同管控',
  ProcessCollaboration: '流程协同与权限控制',
  DataAnalysis: '数据分析与决策支持'
};

const pageTitle = computed(() => titles[route.name] || '业务模块');

const confirmLogout = () => {
  logoutVisible.value = false;
  router.push('/login');
};

const openTip = (message) => {
  tipMessage.value = message;
  tipVisible.value = true;
};
</script>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
  color: #1f2937;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #14b8a6);
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
}

.brand h1 {
  font-size: 16px;
}

.brand p {
  font-size: 12px;
  color: #6b7280;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  text-decoration: none;
  color: #334155;
  padding: 10px 12px;
  border-radius: 10px;
  transition: background 0.2s ease;
  font-weight: 500;
}

.menu-item.router-link-active {
  background: #eef2ff;
  color: #1d4ed8;
}

.ghost-button {
  border: 1px dashed #cbd5f5;
  border-radius: 12px;
  padding: 10px;
  background: #f8fafc;
  cursor: pointer;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 22px 32px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.topbar span {
  color: #64748b;
  font-size: 13px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.primary,
.secondary,
.ghost {
  border-radius: 10px;
  padding: 8px 16px;
  cursor: pointer;
  border: none;
}

.primary {
  background: #2563eb;
  color: #fff;
}

.secondary {
  background: #e0e7ff;
  color: #1e3a8a;
}

.ghost {
  background: #f1f5f9;
  color: #334155;
}

.content {
  padding: 24px 32px 40px;
}

@media (max-width: 960px) {
  .shell {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
