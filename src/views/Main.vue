<template>
  <div class="workspace">
    <header class="topbar">
      <div class="title">
        <span class="dot" />
        <div>
          <p class="eyebrow">Nano Film Studio</p>
          <h2>甘蔗纤维素纳米成膜工作台</h2>
        </div>
      </div>
      <button class="ghost" @click="logout">退出</button>
    </header>
    <div class="layout">
      <nav class="sidebar">
        <router-link to="/main/modeling" class="nav" active-class="active">纤维素建模</router-link>
        <router-link to="/main/control" class="nav" active-class="active">参数调控</router-link>
        <router-link to="/main/analysis" class="nav" active-class="active">材料分析</router-link>
        <router-link to="/main/visualization" class="nav" active-class="active">数据可视化</router-link>
      </nav>
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  localStorage.removeItem('loggedIn');
  router.push('/login');
};
</script>

<style scoped>
.workspace {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.9);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(12px);
}

.title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(120deg, var(--primary), var(--secondary));
  display: inline-block;
}

.eyebrow {
  margin: 0;
  color: #6b7280;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
}

h2 {
  margin: 2px 0 0;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 16px;
  padding: 0 16px 16px;
}

.sidebar {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 14px;
  display: grid;
  gap: 8px;
  align-self: flex-start;
  position: sticky;
  top: 12px;
}

.nav {
  padding: 12px 14px;
  border-radius: 12px;
  font-weight: 700;
  color: #374151;
  border: 1px solid transparent;
  background: #f9fafb;
}

.nav.active {
  background: linear-gradient(120deg, #e0f2fe, #ede9fe);
  border-color: #cbd5e1;
  color: #0f172a;
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.08);
}

.content {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  border: 1px solid var(--border);
  padding: 18px;
  min-height: 70vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.06);
}

.ghost {
  background: #f3f4f6;
  border: 1px solid var(--border);
  color: #374151;
  padding: 10px 16px;
  border-radius: 12px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: relative;
    top: auto;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    overflow-x: auto;
  }
}
</style>
