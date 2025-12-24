<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="flex" style="justify-content: space-between; margin-bottom: 12px;">
        <div>
          <div style="font-weight: 700;">农村电商管理</div>
          <small style="color: var(--muted);">供应/商品/订单/客户</small>
        </div>
        <button class="secondary" @click="showNotice = true">公告</button>
      </div>
      <div class="alert">亮色主题，点击菜单即可切换模块</div>
      <div class="flex" style="flex-direction: column; gap: 10px;">
        <button
          v-for="item in menus"
          :key="item.path"
          class="menu-btn"
          :class="{ active: $route.path.includes(item.path) }"
          @click="go(item.path)"
        >
          {{ item.label }}
        </button>
      </div>
    </aside>
    <div>
      <header class="header">
        <div class="flex">
          <span class="stat-chip">今日亮点</span>
          <span style="color: var(--muted);">表格数据已预置 20+ 条，按钮全部弹窗</span>
        </div>
        <div class="flex">
          <button class="secondary" @click="refreshStats">刷新概览</button>
          <button class="accent" @click="logout">退出登录</button>
        </div>
      </header>
      <main class="content">
        <router-view />
      </main>
    </div>
    <ModalDialog v-model="showNotice" title="系统公告">
      <p>本系统演示了供应、商品、订单、客户与运营、统计分析等独立模块。</p>
      <p>所有按钮均以 modal 形式展示表单、提示或进度条。</p>
      <template #footer>
        <button class="secondary" @click="showNotice = false">我知道了</button>
      </template>
    </ModalDialog>
    <ModalDialog v-model="showProgress" title="数据刷新">
      <p>正在刷新概览数据，请稍候...</p>
      <div class="progress-bar">
        <span :style="{ width: progress + '%' }"></span>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const showNotice = ref(false);
const showProgress = ref(false);
const progress = ref(10);
const menus = [
  { label: '统计与系统', path: '/main/dashboard' },
  { label: '供应管理', path: '/main/supply' },
  { label: '商品与库存', path: '/main/product' },
  { label: '订单与销售', path: '/main/order' },
  { label: '客户与运营', path: '/main/operation' }
];

const go = (path) => router.push(path);

const logout = () => {
  router.push('/login');
};

const refreshStats = () => {
  showProgress.value = true;
  progress.value = 10;
  const timer = setInterval(() => {
    if (progress.value >= 100) {
      clearInterval(timer);
      showProgress.value = false;
    } else {
      progress.value += 25;
    }
  }, 400);
};
</script>
