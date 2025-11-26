<template>
  <div class="layout">
    <aside class="sidebar card">
      <div class="logo">存量用地决策</div>
      <nav>
        <button class="nav-btn" :class="{ active: isActive('Parcels') }" @click="go('Parcels')">
          地块台账
        </button>
        <button class="nav-btn" :class="{ active: isActive('Potential') }" @click="go('Potential')">
          价值评估
        </button>
        <button class="nav-btn" :class="{ active: isActive('Scenarios') }" @click="go('Scenarios')">
          方案模拟
        </button>
        <button class="nav-btn" :class="{ active: isActive('Projects') }" @click="go('Projects')">
          项目计划
        </button>
        <button class="nav-btn" :class="{ active: isActive('Decision') }" @click="go('Decision')">
          决策支持
        </button>
      </nav>
    </aside>
    <main class="content">
      <header class="toolbar card">
        <div>
          <p class="eyebrow">城市更新驾驶舱</p>
          <h2>存量用地评估与更新决策支持系统</h2>
        </div>
        <div class="user-meta">
          <span class="badge info">规划司 · 值班</span>
          <button class="action-btn secondary" @click="backToLogin">退出</button>
        </div>
      </header>
      <section class="card">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const go = (name) => router.push({ name });
const isActive = (name) => route.name === name;
const backToLogin = () => router.push('/');
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 16px;
  padding: 16px;
}

.sidebar {
  display: grid;
  gap: 12px;
  align-content: start;
}

.logo {
  font-weight: 800;
  font-size: 18px;
  color: var(--primary);
}

.nav-btn {
  width: 100%;
  padding: 12px 10px;
  text-align: left;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f8fbff;
  color: #1f2d3d;
  font-weight: 600;
}

.nav-btn.active {
  background: linear-gradient(135deg, #2e8bff, #79c4ff);
  color: #fff;
  border-color: transparent;
  box-shadow: 0 10px 30px rgba(46, 139, 255, 0.25);
}

.content {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 12px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-meta {
  display: flex;
  gap: 12px;
  align-items: center;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  nav {
    display: contents;
  }
  .nav-btn {
    text-align: center;
  }
}
</style>
