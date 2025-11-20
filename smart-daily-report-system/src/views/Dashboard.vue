<template>
  <div class="dashboard">
    <header class="top-bar">
      <div>
        <h1>智能日报流程管理与指标统计</h1>
        <p class="subtitle">全流程透明 · 数据实时可视化 · 多模块联动</p>
      </div>
      <button class="logout" @click="goLogin">退出</button>
    </header>

    <div class="workspace">
      <nav class="sidebar">
        <h2>功能模块</h2>
        <RouterLink
          v-for="link in links"
          :key="link.path"
          class="nav-link"
          :to="link.path"
          active-class="active"
        >
          <span class="icon">{{ link.icon }}</span>
          {{ link.label }}
        </RouterLink>
      </nav>

      <section class="content">
        <RouterView />
      </section>
    </div>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { path: '/dashboard/report-entry', label: '日报录入', icon: '📝' },
  { path: '/dashboard/report-approval', label: '日报审批', icon: '🧾' },
  { path: '/dashboard/data-analysis', label: '数据分析', icon: '📊' },
  { path: '/dashboard/task-management', label: '任务管理', icon: '🗂️' },
  { path: '/dashboard/notification', label: '通知提醒', icon: '🔔' }
]

const goLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fb;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  background: linear-gradient(120deg, #1f6feb, #43b6ff);
  color: #fff;
}

.subtitle {
  margin: 4px 0 0;
  font-size: 14px;
  opacity: 0.8;
}

.logout {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
}

.workspace {
  flex: 1;
  display: flex;
  min-height: 0;
}

.sidebar {
  width: 260px;
  padding: 24px;
  background: #fff;
  border-right: 1px solid #e0e5ef;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #1f2a44;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 12px;
  color: #3c4661;
  transition: background 0.2s ease;
}

.nav-link:hover,
.nav-link.active {
  background: #e6f0ff;
  color: #1f6feb;
  font-weight: 600;
}

.icon {
  font-size: 18px;
}

.content {
  flex: 1;
  padding: 24px;
  overflow: auto;
}
</style>
