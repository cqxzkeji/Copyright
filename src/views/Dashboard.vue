<template>
  <div class="dashboard-layout">
    <aside class="sidebar">
      <div class="brand">逆向推导设计</div>
      <nav>
        <RouterLink to="/dashboard/design-input" class="nav-item" :class="isActive('/dashboard/design-input')">销售技术标准输入</RouterLink>
        <RouterLink to="/dashboard/design-output" class="nav-item" :class="isActive('/dashboard/design-output')">逆向推导结果</RouterLink>
        <RouterLink to="/dashboard/standard-editor" class="nav-item" :class="isActive('/dashboard/standard-editor')">技术标准编辑</RouterLink>
        <RouterLink to="/dashboard/data-analytics" class="nav-item" :class="isActive('/dashboard/data-analytics')">数据分析与优化</RouterLink>
        <RouterLink to="/dashboard/settings" class="nav-item" :class="isActive('/dashboard/settings')">系统设置与用户管理</RouterLink>
      </nav>
      <div class="sidebar-footer">
        <button class="secondary" @click="logout">退出登录</button>
      </div>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="tooltip">模块独立运行，内容区加载对应功能</p>
          <h2>智慧钢材销售·逆向推导中心</h2>
        </div>
        <div class="chip-row">
          <span class="badge">明亮主题</span>
          <span class="badge" style="background: rgba(74, 217, 145, 0.16); color: #0b8b56;">自适应布局</span>
        </div>
      </header>
      <section class="content-area">
        <RouterView />
      </section>
    </main>
  </div>
</template>

<script setup>
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isActive = (path) => (route.path === path ? 'active' : '')
const logout = () => router.push('/login')
</script>

<style scoped>
.dashboard-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: var(--bg);
}

.sidebar {
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.brand {
  font-size: 18px;
  font-weight: 800;
  color: var(--primary);
}

nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
}

.nav-item {
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  color: var(--text);
  transition: all 0.2s ease;
}

.nav-item:hover,
.nav-item.active {
  background: rgba(31, 142, 250, 0.08);
  border-color: var(--border);
}

.sidebar-footer {
  margin-top: auto;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-area {
  min-height: 80vh;
}

@media (max-width: 900px) {
  .dashboard-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    align-items: center;
    overflow-x: auto;
  }
  nav {
    flex-direction: row;
    gap: 10px;
  }
}
</style>
