<template>
  <div class="main-layout">
    <aside>
      <h3>跨境经贸系统</h3>
      <nav>
        <router-link to="/main/trade-info">贸易信息</router-link>
        <router-link to="/main/contract">合同协议</router-link>
        <router-link to="/main/payment">支付结算</router-link>
        <router-link to="/main/market-analysis">市场分析</router-link>
        <router-link to="/main/logistics">物流供应链</router-link>
      </nav>
      <button class="btn secondary" @click="logout">退出</button>
    </aside>
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
const logout = () => {
  localStorage.removeItem('cbtm_user')
  router.push('/login')
}
</script>
