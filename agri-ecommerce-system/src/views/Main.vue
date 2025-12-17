<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="leaf-mark"></div>
        <div>
          <strong>农品云控台</strong>
          <div class="muted" style="font-size: 12px;">Agri Commerce</div>
        </div>
      </div>
      <nav>
        <router-link to="/main/dashboard" class="nav-item" :class="{ active: isActive('/main/dashboard') }">数据总览</router-link>
        <router-link to="/main/product" class="nav-item" :class="{ active: isActive('/main/product') }">商品管理</router-link>
        <router-link to="/main/trade" class="nav-item" :class="{ active: isActive('/main/trade') }">交易管理</router-link>
        <router-link to="/main/order" class="nav-item" :class="{ active: isActive('/main/order') }">订单管理</router-link>
        <router-link to="/main/after-sales" class="nav-item" :class="{ active: isActive('/main/after-sales') }">库存与售后</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div class="chip">运营日程</div>
        <div class="flex">
          <span class="muted hide-mobile">轻量化亮色主题，自适应布局</span>
          <div class="avatar">农</div>
        </div>
      </header>
      <section class="content-area">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
const isActive = (path) => route.path === path;
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 22px 18px;
  display: grid;
  align-content: start;
  gap: 18px;
}

.brand {
  display: flex;
  gap: 10px;
  align-items: center;
}

.leaf-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(160deg, #6ee7b7, #22c55e);
  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

nav { display: grid; gap: 8px; }
.nav-item {
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--muted);
  font-weight: 600;
}

.nav-item.active, .nav-item:hover {
  background: linear-gradient(90deg, #eef4ff, #fff);
  color: var(--primary);
  border: 1px solid var(--border);
}

.content {
  display: grid;
  grid-template-rows: auto 1fr;
  background: var(--bg);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  position: sticky;
  top: 0;
  background: rgba(245, 247, 251, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  z-index: 1;
}

.content-area {
  padding: 18px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--primary);
  color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-weight: 700;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style>
