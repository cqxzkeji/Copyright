<template>
  <div class="layout">
    <aside class="sidebar">
      <h2>幸福管家</h2>
      <nav>
        <RouterLink to="/main/client-management">客户信息管理</RouterLink>
        <RouterLink to="/main/service-request">服务需求管理</RouterLink>
        <RouterLink to="/main/service-monitoring">服务质量监控</RouterLink>
        <RouterLink to="/main/client-interaction">客户互动管理</RouterLink>
        <RouterLink to="/main/business-reports">业务统计与报告</RouterLink>
      </nav>
      <button class="btn secondary" @click="logout">退出登录</button>
    </aside>
    <main class="content"><RouterView /></main>
  </div>
</template>

<script setup>
import { useRouter, RouterView, RouterLink } from 'vue-router';

const router = useRouter();
const logout = () => {
  localStorage.removeItem('hh_logged_in');
  router.push('/login');
};
</script>
