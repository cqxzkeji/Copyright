<template>
  <div class="app-layout">
    <aside class="section-card" style="position: sticky; top: 18px; height: fit-content;">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; margin-bottom: 14px;">
        <div>
          <div class="card-title">运营控制台</div>
          <div class="card-subtitle">农产品电商业务</div>
        </div>
        <button class="ghost" @click="showLogout = true">退出</button>
      </div>
      <nav class="grid">
        <router-link to="/main/products" class="nav-link" :class="{ active: isActive('products') }">商品管理</router-link>
        <router-link to="/main/trade" class="nav-link" :class="{ active: isActive('trade') }">交易结算</router-link>
        <router-link to="/main/orders" class="nav-link" :class="{ active: isActive('orders') }">订单管理</router-link>
        <router-link to="/main/after-sales" class="nav-link" :class="{ active: isActive('after-sales') }">售后评价</router-link>
        <router-link to="/main/dashboard" class="nav-link" :class="{ active: isActive('dashboard') }">数据与设置</router-link>
      </nav>
    </aside>
    <main>
      <router-view />
    </main>
    <div v-if="showLogout" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <h3>退出登录</h3>
          <button class="ghost" @click="showLogout = false">✕</button>
        </div>
        <p>确定退出当前账号吗？</p>
        <div class="modal-actions">
          <button class="ghost" @click="showLogout = false">取消</button>
          <button class="primary" @click="logout">退出</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const showLogout = ref(false)

const isActive = (name) => computed(() => route.name === name).value

const logout = () => {
  localStorage.removeItem('agri-token')
  showLogout.value = false
  router.push('/login')
}
</script>
