<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">智能营销</div>
      <nav>
        <router-link to="/app/dashboard">数据监控</router-link>
        <router-link to="/app/campaigns">活动跟踪</router-link>
        <router-link to="/app/audience">受众分析</router-link>
        <router-link to="/app/roi">投资回报</router-link>
        <router-link to="/app/conversion">转化率</router-link>
        <router-link to="/app/settings">系统设置</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="top-bar">
        <div class="title">营销活动智能统计与效果分析</div>
        <button class="logout" @click="logout">退出</button>
      </header>
      <section class="content-body">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const logout = () => {
  sessionStorage.removeItem('marketing-auth');
  router.push('/login');
};
</script>
