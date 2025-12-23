<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">乡村</div>
        <div>
          <div class="brand-title">农村电商综合服务管理平台</div>
          <div class="brand-sub">农村资源一体化调度</div>
        </div>
      </div>
      <nav class="menu">
        <RouterLink v-for="item in menu" :key="item.path" :to="item.path" class="menu-item" active-class="active">
          <span>{{ item.label }}</span>
        </RouterLink>
      </nav>
      <div class="side-footer">
        <div class="badge">当前用户：乡村运营中心</div>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <div class="topbar-title">今日运营概览</div>
          <div class="topbar-sub">实时监控订单、资源与服务进度</div>
        </div>
        <div class="topbar-actions">
          <button class="btn secondary" @click="openNotice">系统通知</button>
          <button class="btn" @click="openSync">数据同步</button>
        </div>
      </header>
      <RouterView />
    </main>
    <BaseModal :open="noticeOpen" title="系统通知" :on-close="closeNotice">
      <p>今日新增订单 128 单，冷链资源已匹配 92%。</p>
      <p>乡镇服务站点在线率 100%，服务工单全部按时处理。</p>
      <template #footer>
        <button class="btn secondary" @click="closeNotice">知道了</button>
      </template>
    </BaseModal>
    <BaseModal :open="syncOpen" title="数据同步进度" :on-close="closeSync">
      <p>正在同步订单、物流、营销数据。</p>
      <div class="progress" style="margin-top: 16px;">
        <span :style="{ width: '78%' }"></span>
      </div>
      <p style="margin-top: 12px; color: #64748b;">预计剩余 1 分钟完成。</p>
      <template #footer>
        <button class="btn" @click="closeSync">完成</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';
import BaseModal from './BaseModal.vue';

const menu = [
  { label: '综合数据看板', path: '/dashboard' },
  { label: '农产品与资源管理', path: '/products' },
  { label: '订单与物流管理', path: '/orders' },
  { label: '运营与营销管理', path: '/marketing' },
  { label: '数据统计分析', path: '/analysis' },
  { label: '系统配置与服务管理', path: '/settings' }
];

const noticeOpen = ref(false);
const syncOpen = ref(false);

const openNotice = () => {
  noticeOpen.value = true;
};
const closeNotice = () => {
  noticeOpen.value = false;
};
const openSync = () => {
  syncOpen.value = true;
};
const closeSync = () => {
  syncOpen.value = false;
};
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f5f7fb;
}

.sidebar {
  background: #ffffff;
  padding: 24px;
  border-right: 1px solid #e2e8f0;
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
  border-radius: 14px;
  background: linear-gradient(135deg, #60a5fa, #22d3ee);
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 700;
}

.brand-title {
  font-weight: 700;
  font-size: 14px;
}

.brand-sub {
  font-size: 12px;
  color: #64748b;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 12px;
  background: #f1f5f9;
  font-size: 14px;
  font-weight: 600;
}

.menu-item.active {
  background: #e0f2fe;
  color: #0284c7;
}

.side-footer {
  margin-top: auto;
}

.content {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.topbar-title {
  font-size: 20px;
  font-weight: 700;
}

.topbar-sub {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .topbar {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
