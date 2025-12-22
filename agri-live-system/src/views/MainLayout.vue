<template>
  <div class="app-shell">
    <aside class="sidebar">
      <div class="brand">农产品直播运营</div>
      <nav class="nav-links">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ active: route.path === item.path }"
        >
          {{ item.label }}
        </RouterLink>
      </nav>
      <div class="card" style="padding: 14px; font-size: 13px; color: #6b7280;">
        当前账号：admin@agri.com
      </div>
    </aside>
    <main class="main-content">
      <header class="topbar">
        <h2>{{ pageTitle }}</h2>
        <button class="btn ghost" type="button" @click="logout">退出登录</button>
      </header>
      <section class="content-area">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const navItems = [
  { label: '运营总览', path: '/main/dashboard' },
  { label: '直播与商品管理', path: '/main/live-manage' },
  { label: '主播管理', path: '/main/anchor-manage' },
  { label: '订单管理', path: '/main/order-manage' },
  { label: '数据分析', path: '/main/data-analysis' },
  { label: '系统设置', path: '/main/system-setting' }
]

const pageTitle = computed(() => {
  const item = navItems.find((nav) => nav.path === route.path)
  return item?.label ?? '农产品直播运营'
})

const logout = () => {
  router.push('/login')
}
</script>
