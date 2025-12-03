<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="logo">优特钢</div>
      <nav>
        <RouterLink to="/orders" class="nav-item" :class="{ active: isActive('/orders') }">订单管理</RouterLink>
        <RouterLink to="/products" class="nav-item" :class="{ active: isActive('/products') }">产品定制</RouterLink>
        <RouterLink to="/sales" class="nav-item" :class="{ active: isActive('/sales') }">销售跟踪</RouterLink>
        <RouterLink to="/inventory" class="nav-item" :class="{ active: isActive('/inventory') }">库存管理</RouterLink>
        <RouterLink to="/reports" class="nav-item" :class="{ active: isActive('/reports') }">报表生成</RouterLink>
      </nav>
      <div class="user-card">
        <div class="name">杨工</div>
        <div class="role">销售主管</div>
        <button class="btn secondary" @click="logout">退出登录</button>
      </div>
    </aside>

    <main class="content">
      <header class="content-header">
        <div>
          <div class="badge">定制销售标准流程</div>
          <h2>优特钢业务驾驶舱</h2>
        </div>
        <button class="btn" @click="openNotice">公告</button>
      </header>

      <section class="card">
        <router-view />
      </section>
    </main>

    <div v-if="showNotice" class="overlay">
      <div class="modal">
        <header>
          <h3>系统公告</h3>
          <button class="btn secondary" @click="showNotice = false">关闭</button>
        </header>
        <p>请按标准流程录入订单，确保定制需求与库存同步更新。</p>
        <footer>
          <button class="btn" @click="showNotice = false">我知道了</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { ref } from 'vue';

const route = useRoute();
const router = useRouter();
const showNotice = ref(false);

const isActive = (path) => route.path === path;

const logout = () => router.push('/login');
const openNotice = () => (showNotice.value = true);
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #ffffff;
  border-right: 1px solid #e8f0ff;
  padding: 20px;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 18px;
}

.logo {
  font-weight: 800;
  font-size: 22px;
  color: #2d5b9f;
}

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  color: #2a4365;
  margin-bottom: 8px;
  transition: background 0.2s ease;
}

.nav-item.active,
.nav-item:hover {
  background: linear-gradient(90deg, #e6f1ff, #f4f9ff);
  color: #1c3f75;
}

.user-card {
  padding: 12px;
  border-radius: 12px;
  background: #f1f7ff;
  display: grid;
  gap: 6px;
  color: #1f3b5a;
}

.content {
  padding: 20px;
  display: grid;
  gap: 12px;
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.content-header h2 {
  margin: 6px 0 0;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}
</style>
