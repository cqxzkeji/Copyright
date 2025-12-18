<template>
  <div>
    <header class="app-header">
      <div style="display: flex; align-items: center; gap: 10px;">
        <span class="badge">农产品产供销一体化</span>
        <strong>智慧农业管控驾驶舱</strong>
      </div>
      <div class="nav-tabs">
        <router-link to="/app/production">生产管理</router-link>
        <router-link to="/app/supply">采购与供应链</router-link>
        <router-link to="/app/sales">销售与订单</router-link>
        <router-link to="/app/trace">质量追溯</router-link>
        <router-link to="/app/analytics">数据分析</router-link>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <span class="tag">
          <span style="width:10px;height:10px;border-radius:50%;background:#2ec4b6;display:inline-block"></span>
          在线
        </span>
        <button class="secondary-btn" @click="logout">退出</button>
      </div>
    </header>
    <main class="main-area">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  sessionStorage.removeItem('agri-user');
  router.push('/login');
};
</script>
