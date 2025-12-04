<template>
  <div class="app-shell">
    <div v-if="!authed" class="login-overlay">
      <div class="login-card">
        <h2>登录行为与推荐控制台</h2>
        <p class="muted">请输入工号与令牌以继续</p>
        <div class="form-row">
          <label class="label">工号</label>
          <input v-model="form.user" placeholder="如：ops-1208" />
        </div>
        <div class="form-row">
          <label class="label">访问令牌</label>
          <input type="password" v-model="form.token" placeholder="******" />
        </div>
        <button class="primary-btn" style="width: 100%" @click="login">进入主界面</button>
      </div>
    </div>

    <div v-else class="layout">
      <aside class="sidebar">
        <div class="brand">用户行为·推荐</div>
        <nav>
          <RouterLink to="/behavior" class="nav-item" :class="isActive('/behavior')">行为洞察</RouterLink>
          <RouterLink to="/recommendation" class="nav-item" :class="isActive('/recommendation')">推荐系统</RouterLink>
          <RouterLink to="/collection" class="nav-item" :class="isActive('/collection')">采集与处理</RouterLink>
          <RouterLink to="/analytics" class="nav-item" :class="isActive('/analytics')">统计分析</RouterLink>
          <RouterLink to="/settings" class="nav-item" :class="isActive('/settings')">系统设置</RouterLink>
        </nav>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <p class="badge">控制台</p>
            <h2 style="margin: 6px 0 0">用户行为数据分析与推荐系统</h2>
          </div>
          <div class="user-box">
            <div>
              <p style="margin: 0; font-weight: 700">{{ form.user || '访客' }}</p>
              <small class="muted">亮色 / 自适应布局</small>
            </div>
            <button class="secondary-btn" @click="logout">退出</button>
          </div>
        </header>
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, RouterLink, RouterView } from 'vue-router'

const authed = ref(false)
const form = reactive({ user: '', token: '' })
const route = useRoute()

const login = () => {
  authed.value = true
}

const logout = () => {
  authed.value = false
  form.user = ''
  form.token = ''
}

const isActive = (path) => (route.path === path ? 'active' : '')
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
}

.layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
}

.sidebar {
  background: #eef2ff;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border-right: 1px solid var(--border);
}

.brand {
  font-weight: 800;
  font-size: 18px;
  color: #1d4ed8;
}

.nav-item {
  display: block;
  padding: 12px 14px;
  border-radius: 12px;
  color: var(--text);
  margin-bottom: 6px;
  border: 1px solid transparent;
  background: white;
}

.nav-item.active {
  border-color: var(--primary);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.1);
}

.content {
  padding: 20px 24px 32px;
  display: grid;
  gap: 18px;
}

.topbar {
  background: var(--card);
  border-radius: 16px;
  padding: 14px 18px;
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.user-box {
  display: flex;
  gap: 12px;
  align-items: center;
}

.muted {
  color: var(--muted);
}

.login-overlay {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #e0f2fe, #eef2ff);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.login-card {
  width: min(420px, 92vw);
  background: white;
  padding: 28px;
  border-radius: 16px;
  box-shadow: 0 18px 40px rgba(37, 99, 235, 0.12);
  display: grid;
  gap: 12px;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .nav-item {
    flex: 1;
  }
  .topbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
