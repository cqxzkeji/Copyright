<template>
  <div class="app-shell">
    <template v-if="isLogin">
      <router-view />
    </template>
    <template v-else>
      <aside class="sidebar">
        <div class="logo">验收跟踪系统</div>
        <nav class="menu">
          <router-link v-for="item in menu" :key="item.path" :to="item.path" class="menu-link">
            <span class="menu-label">{{ item.label }}</span>
          </router-link>
        </nav>
        <div class="sidebar-footer">亮色体验 · 自适应布局</div>
      </aside>
      <main class="main-content">
        <header class="topbar">
          <div>
            <h1 class="page-title">{{ currentTitle }}</h1>
            <p class="page-subtitle">住宅地下室及裙楼公区装修验收跟踪系统</p>
          </div>
          <div class="top-actions">
            <button class="ghost-button">通知中心</button>
            <button class="primary-button">管理员</button>
          </div>
        </header>
        <section class="content-area">
          <router-view />
        </section>
      </main>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menu = [
  { path: '/dashboard', label: '总览' },
  { path: '/task', label: '验收任务管理' },
  { path: '/standard', label: '验收标准管理' },
  { path: '/inspect', label: '现场验收记录' },
  { path: '/issue', label: '整改跟踪与统计' },
  { path: '/report', label: '验收报告归档' }
]

const isLogin = computed(() => route.path === '/login')

const currentTitle = computed(() => {
  const found = menu.find((item) => item.path === route.path)
  return found?.label ?? '验收系统'
})
</script>

<style scoped>
:global(body) {
  margin: 0;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background: #f5f7fb;
  color: #1f2a44;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  background: #f5f7fb;
}

.sidebar {
  width: 240px;
  background: #ffffff;
  border-right: 1px solid #e7ebf3;
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.logo {
  font-weight: 700;
  font-size: 18px;
  color: #2563eb;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.menu-link {
  display: flex;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #1f2a44;
  background: #f5f7fb;
  transition: all 0.2s ease;
}

.menu-link.router-link-active {
  background: #e0ebff;
  color: #1d4ed8;
  font-weight: 600;
}

.menu-link:hover {
  background: #edf2ff;
}

.menu-label {
  font-size: 14px;
}

.sidebar-footer {
  margin-top: auto;
  font-size: 12px;
  color: #94a3b8;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  padding: 28px 36px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.page-title {
  margin: 0;
  font-size: 24px;
}

.page-subtitle {
  margin: 4px 0 0;
  font-size: 13px;
  color: #64748b;
}

.top-actions {
  display: flex;
  gap: 12px;
}

.primary-button,
.ghost-button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.primary-button {
  background: #2563eb;
  color: #fff;
}

.ghost-button {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  color: #1f2a44;
}

.content-area {
  padding: 0 36px 36px;
}

@media (max-width: 1024px) {
  .sidebar {
    width: 200px;
  }
  .topbar {
    padding: 24px;
  }
  .content-area {
    padding: 0 24px 24px;
  }
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
  .menu {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .menu-link {
    padding: 10px 12px;
  }
}
</style>
