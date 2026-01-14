<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">
        <div class="logo-icon">田</div>
        <div>
          <h2>农地抵押链</h2>
          <span>可信业务协同</span>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/dashboard" class="menu-item">监管数据驾驶舱</router-link>
        <router-link to="/main/land-assets" class="menu-item">农地资产确权管理</router-link>
        <router-link to="/main/loan-process" class="menu-item">抵押贷款全流程</router-link>
        <router-link to="/main/chain-evidence" class="menu-item">链上存证与合约</router-link>
        <router-link to="/main/post-loan-risk" class="menu-item">贷后监测与风控</router-link>
        <router-link to="/main/system-setting" class="menu-item">角色权限与审计</router-link>
      </nav>
      <div class="sidebar-footer">
        <div>
          <p>当前节点：省农信总行</p>
          <small>区块高度：#128,940</small>
        </div>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>农地抵押贷款业务工作台</h1>
          <span>实时同步区块链存证与监管视图</span>
        </div>
        <div class="user">
          <div>
            <strong>信贷运营专员</strong>
            <p>HN-001 · 银行端</p>
          </div>
          <button class="button ghost" @click="handleLogout">退出</button>
        </div>
      </header>
      <div class="content-body">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  router.push('/');
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #eef2f7;
  padding: 24px 18px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: #3b82f6;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.logo h2 {
  font-size: 18px;
}

.logo span {
  color: #64748b;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  color: #334155;
  font-weight: 500;
  transition: all 0.2s ease;
}

.menu-item.router-link-active {
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px;
  color: #475569;
  font-size: 12px;
}

.content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  background: #ffffff;
  padding: 20px 26px;
  border-bottom: 1px solid #eef2f7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.topbar h1 {
  font-size: 20px;
}

.topbar span {
  color: #64748b;
  font-size: 13px;
}

.user {
  display: flex;
  align-items: center;
  gap: 16px;
  text-align: right;
}

.user p {
  color: #64748b;
  font-size: 12px;
}

.content-body {
  flex: 1;
  overflow-y: auto;
  background: #f5f8ff;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
