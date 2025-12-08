<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">江南园林·实训</div>
      <nav>
        <router-link to="/main/rock-formation" class="nav-item" active-class="active">假山叠石工艺</router-link>
        <router-link to="/main/tools" class="nav-item" active-class="active">工具使用</router-link>
        <router-link to="/main/interactive" class="nav-item" active-class="active">互动学习</router-link>
        <router-link to="/main/assessment" class="nav-item" active-class="active">成绩评估</router-link>
        <router-link to="/main/management" class="nav-item" active-class="active">管理后台</router-link>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="badge">登陆成功</p>
          <h2>虚拟仿真主工作台</h2>
        </div>
        <button class="secondary-button" @click="goLogin">切换账户</button>
      </header>
      <section class="module-container">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const goLogin = () => router.push('/login');
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #0f172a;
  color: #e2e8f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.brand {
  font-size: 20px;
  font-weight: 800;
}

.nav-item {
  display: block;
  padding: 10px 12px;
  border-radius: 12px;
  color: inherit;
  margin-bottom: 6px;
}

.nav-item.active,
.nav-item:hover {
  background: linear-gradient(135deg, #3b82f6, #22c55e);
  color: #ffffff;
}

.content {
  padding: 20px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.module-container {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }
}
</style>
