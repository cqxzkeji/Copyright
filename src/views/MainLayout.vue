<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">跨境经贸系统</div>
      <nav>
        <router-link to="/main/trade-info">信息采集</router-link>
        <router-link to="/main/contract">合同管理</router-link>
        <router-link to="/main/payment">支付结算</router-link>
        <router-link to="/main/market-analysis">市场分析</router-link>
        <router-link to="/main/logistics">物流供应链</router-link>
      </nav>
      <button class="btn logout" @click="logout">退出登录</button>
    </aside>
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const logout = () => {
  sessionStorage.removeItem('loggedIn')
  router.push('/login')
}
</script>
