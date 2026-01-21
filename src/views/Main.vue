<template>
  <div class="main-layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">FV</div>
        <div>
          <h2>果蔬订单系统</h2>
          <span>订单式采摘运营</span>
        </div>
      </div>
      <nav class="menu">
        <router-link to="/main/order" class="menu-item">订单预约管理</router-link>
        <router-link to="/main/harvest" class="menu-item">采摘计划与库存</router-link>
        <router-link to="/main/sales" class="menu-item">价格与销售管理</router-link>
        <router-link to="/main/customer" class="menu-item">用户与客户管理</router-link>
        <router-link to="/main/analytics" class="menu-item">数据统计与分析</router-link>
      </nav>
      <div class="sidebar-footer">
        <span>菜单栏固定宽度</span>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <h1>果蔬订单式采摘预约与销售系统</h1>
          <p>集中展示五大功能模块，支持预约、计划、销售、客户与分析。</p>
        </div>
        <div class="topbar-actions">
          <button class="ghost" @click="openNotice">系统公告</button>
          <button class="primary" @click="openSupport">运营支持</button>
        </div>
      </header>
      <section class="content-panel">
        <router-view />
      </section>
    </main>

    <BaseModal v-model="modalVisible" :title="modalTitle">
      <p>{{ modalMessage }}</p>
      <template #footer>
        <button class="primary" @click="modalVisible = false">知道了</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import BaseModal from '../components/BaseModal.vue';

const modalVisible = ref(false);
const modalTitle = ref('');
const modalMessage = ref('');

const openNotice = () => {
  modalTitle.value = '系统公告';
  modalMessage.value = '今日已更新果蔬批次价格与库存预警规则。';
  modalVisible.value = true;
};

const openSupport = () => {
  modalTitle.value = '运营支持';
  modalMessage.value = '客服已上线，可协助处理团购客户的紧急订单。';
  modalVisible.value = true;
};
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid var(--border);
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
  width: 44px;
  height: 44px;
  background: var(--primary);
  color: #fff;
  display: grid;
  place-items: center;
  border-radius: 12px;
  font-weight: 700;
}

.brand h2 {
  margin: 0;
  font-size: 18px;
}

.brand span {
  font-size: 12px;
  color: var(--muted);
}

.menu {
  display: grid;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f4f7f5;
  font-size: 14px;
  color: #2d3a32;
}

.menu-item.router-link-active {
  background: #e6f4ea;
  color: var(--primary-dark);
  font-weight: 600;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: var(--muted);
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
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  background: var(--card);
  padding: 20px 24px;
  border-radius: 16px;
  border: 1px solid var(--border);
}

.topbar h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.topbar p {
  margin: 0;
  color: var(--muted);
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.content-panel {
  flex: 1;
  background: var(--card);
  border-radius: 18px;
  padding: 20px;
  border: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.primary {
  background: var(--primary);
  border: none;
  color: white;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
}

.ghost {
  background: transparent;
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .menu {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}
</style>
