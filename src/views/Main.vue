<template>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="dot" />
        <div>
          <p class="eyebrow">智能驱控</p>
          <strong>精准操控控制台</strong>
        </div>
      </div>
      <nav class="nav">
        <RouterLink
          v-for="item in menu"
          :key="item.path"
          :to="item.path"
          class="nav__item"
          :class="{ active: isActive(item.path) }"
        >
          <span>{{ item.label }}</span>
          <small>{{ item.desc }}</small>
        </RouterLink>
      </nav>
    </aside>
    <main class="content">
      <header class="topbar">
        <div>
          <p class="eyebrow">WORKBENCH</p>
          <h2>智能驱控式精准操控机器臂控制系统</h2>
        </div>
        <div class="topbar__actions">
          <button class="ghost" @click="showAnnouncement = true">操作提示</button>
          <button class="primary" @click="logout">退出</button>
        </div>
      </header>
      <section class="viewport">
        <router-view />
      </section>
    </main>
    <ModalDialog :show="showAnnouncement" title="安全提示" @close="showAnnouncement = false" @confirm="showAnnouncement = false">
      <ul class="tips">
        <li>执行前请确认机械臂末端已固定工装，场景内无障碍物。</li>
        <li>校准后务必保存零点，避免漂移带来的姿态误差。</li>
        <li>高负载模式下持续工作请关注温升，必要时切换降噪模式。</li>
      </ul>
    </ModalDialog>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const route = useRoute()
const router = useRouter()
const showAnnouncement = ref(false)

const menu = [
  { path: '/main/arm-control', label: '机器臂控制', desc: '姿态 / 轨迹 / 安全区' },
  { path: '/main/calibration', label: '校准与配置', desc: '零点 / 末端参数' },
  { path: '/main/performance', label: '性能监控', desc: '振动 / 温度 / 负载' },
  { path: '/main/tasks', label: '任务调度', desc: '队列 / 复用 / 编排' },
  { path: '/main/settings', label: '系统设置', desc: '用户 / 备份 / 日志' }
]

const isActive = (path) => computed(() => route.path === path).value

const logout = () => {
  localStorage.removeItem('smart-arm-auth')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: #f6f8fb;
}

.sidebar {
  background: #fff;
  border-right: 1px solid var(--border);
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: sticky;
  top: 0;
  height: 100vh;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary), var(--success));
  box-shadow: 0 0 0 6px rgba(45, 156, 219, 0.12);
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav__item {
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--border);
  background: #f9fbff;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #1b2a3c;
  transition: all 0.2s ease;
}

.nav__item:hover {
  border-color: var(--primary);
  box-shadow: 0 12px 18px rgba(45, 156, 219, 0.12);
}

.nav__item.active {
  background: linear-gradient(135deg, rgba(45, 156, 219, 0.08), #fff);
  border-color: var(--primary);
}

.nav small {
  color: var(--muted);
}

.content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.topbar {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 14px 18px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  box-shadow: var(--shadow);
}

.topbar__actions {
  display: flex;
  gap: 10px;
}

.topbar__actions button {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
}

.topbar__actions .ghost {
  background: #eef2f7;
  border: 1px solid var(--border);
}

.topbar__actions .primary {
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #fff;
}

.viewport {
  flex: 1;
  min-height: 70vh;
}

.tips {
  padding-left: 18px;
  color: #294455;
}

.eyebrow {
  color: var(--primary);
  letter-spacing: 0.08em;
  font-weight: 700;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    height: auto;
    position: relative;
  }
}
</style>
