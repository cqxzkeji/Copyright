<template>
  <div class="layout">
    <aside class="card sidebar">
      <h3>业务功能</h3>
      <router-link v-for="item in menu" :key="item.to" :to="item.to" class="item">{{ item.label }}</router-link>
      <button class="secondary" @click="logout">退出登录</button>
    </aside>
    <section class="content">
      <router-view />
    </section>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
const menu = [
  { label: '市场监测', to: '/dashboard/market' },
  { label: '风险评估', to: '/dashboard/risk' },
  { label: '合规性检查', to: '/dashboard/compliance' },
  { label: '供应链优化', to: '/dashboard/supply' },
  { label: '数据报告分析', to: '/dashboard/reports' }
];
const logout = () => {
  sessionStorage.removeItem('trade-auth');
  router.push('/login');
};
</script>

<style scoped>
.layout { display: grid; grid-template-columns: 250px 1fr; min-height: 100vh; gap: 14px; padding: 14px; }
.sidebar { padding: 16px; display: grid; align-content: start; gap: 10px; }
.item { text-decoration: none; color: #3a5f88; background: #f4f9ff; padding: 10px; border-radius: 9px; }
.item.router-link-active { background: #dcedff; color: #1e5ec6; font-weight: 700; }
.content { min-width: 0; }
@media (max-width: 920px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  h3, .sidebar .secondary { grid-column: 1 / -1; }
}
</style>
