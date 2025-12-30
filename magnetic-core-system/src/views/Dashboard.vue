<template>
  <div class="layout" :class="{ 'login-mode': isLogin }">
    <div v-if="isLogin" class="login-panel card">
      <div class="login-left">
        <h1>磁芯制造工艺数据采集与分析系统</h1>
        <p class="muted">面向工艺数据采集、实时监控、质量分析与系统管理的一站式平台。</p>
        <div class="login-highlights">
          <div class="highlight">实时监控 · 阈值预警 · 批次追溯</div>
          <div class="highlight">统计分析 · 优化决策 · 数据导出</div>
        </div>
      </div>
      <div class="login-form card">
        <h3>登录系统</h3>
        <div class="grid" style="gap:12px; margin-top:12px;">
          <div>
            <div class="label">账号</div>
            <input v-model="loginForm.username" class="input" placeholder="请输入工号或账号" />
          </div>
          <div>
            <div class="label">密码</div>
            <input v-model="loginForm.password" type="password" class="input" placeholder="请输入密码" />
          </div>
          <button class="btn" @click="handleLogin">立即登录</button>
          <div class="muted small">为保证安全，请勿在公共设备记住密码。</div>
        </div>
      </div>
    </div>

    <div v-else class="shell">
      <aside class="side">
        <div class="brand">
          <div class="brand-mark">MC</div>
          <div>
            <div class="brand-title">磁芯工艺平台</div>
            <div class="brand-sub">数据采集 · 分析 · 优化</div>
          </div>
        </div>
        <nav class="menu">
          <a
            v-for="item in menus"
            :key="item.path"
            :class="['menu-item', { active: route.path === item.path }]"
            @click="go(item.path)"
          >
            <span>{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </nav>
      </aside>
      <main class="content">
        <header class="topbar">
          <div>
            <div class="breadcrumb">磁芯制造 / {{ activeName }}</div>
            <div class="page-title">{{ activeName }}</div>
          </div>
          <div class="user">
            <div class="user-avatar">{{ loginForm.username?.[0]?.toUpperCase() || '操' }}</div>
            <div>
              <div class="user-name">{{ loginForm.username || '操作员' }}</div>
              <div class="muted small">设备状态良好</div>
            </div>
            <button class="btn ghost" @click="logout">退出</button>
          </div>
        </header>
        <div class="page-body">
          <router-view />
        </div>
      </main>
    </div>

    <div v-if="loginModal" class="modal-backdrop">
      <div class="modal">
        <h3>登录提示</h3>
        <p style="margin: 12px 0; color: var(--muted);">{{ loginTip }}</p>
        <div class="progress-bar" style="margin: 12px 0 18px;">
          <div class="progress-bar-inner" :style="{ width: progress + '%' }"></div>
        </div>
        <div style="text-align: right;">
          <button class="btn" @click="closeLoginModal">好的</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const loginForm = reactive({ username: '', password: '' })
const loginModal = ref(false)
const loginTip = ref('正在核验账号信息...')
const progress = ref(35)
const menus = [
  { label: '工艺数据采集', path: '/home/data', icon: '📡' },
  { label: '过程监控与预警', path: '/home/process', icon: '⏱️' },
  { label: '质量检测分析', path: '/home/quality', icon: '🧪' },
  { label: '统计分析与优化', path: '/home/stats', icon: '📊' },
  { label: '系统管理与服务', path: '/home/system', icon: '🛠️' }
]

const isLogin = computed(() => route.path === '/login')
const activeName = computed(() => menus.find((m) => route.path === m.path)?.label || '总览监控')

watch(route, () => {
  if (route.path.startsWith('/home') && isLogin.value) {
    router.replace('/login')
  }
})

const handleLogin = () => {
  if (!loginForm.username || !loginForm.password) {
    loginTip.value = '请填写完整账号和密码信息后登录。'
    progress.value = 25
    loginModal.value = true
    return
  }
  loginTip.value = '登录成功，正在加载主界面...'
  progress.value = 85
  loginModal.value = true
  setTimeout(() => {
    progress.value = 100
    router.push('/home/data')
  }, 400)
}

const closeLoginModal = () => {
  loginModal.value = false
}

const go = (path) => {
  router.push(path)
}

const logout = () => {
  loginTip.value = '已退出，请重新登录系统。'
  progress.value = 50
  loginModal.value = true
  router.push('/login')
}
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #e0f2fe, #eef2ff);
}

.login-mode {
  align-items: center;
  justify-content: center;
}

.login-panel {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  padding: 28px;
  width: min(1080px, 96vw);
}

.login-left {
  padding: 18px;
}

.login-left h1 {
  margin: 0;
  font-size: 28px;
}

.login-form {
  background: #fff;
}

.login-highlights {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.highlight {
  padding: 12px;
  border-radius: 10px;
  background: #eef2ff;
  color: #111827;
  font-weight: 600;
}

.muted { color: var(--muted); }
.small { font-size: 12px; }

.shell {
  display: grid;
  grid-template-columns: 240px 1fr;
  width: 100%;
}

.side {
  background: #0f172a;
  color: white;
  padding: 24px 18px;
  min-height: 100vh;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 28px;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  display: grid;
  place-items: center;
  font-weight: 800;
}

.brand-title { font-weight: 700; }
.brand-sub { color: #cbd5e1; font-size: 13px; }

.menu {
  display: grid;
  gap: 8px;
}

.menu-item {
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  display: flex;
  gap: 10px;
  align-items: center;
  font-weight: 600;
  color: #cbd5e1;
}

.menu-item:hover, .menu-item.active {
  background: linear-gradient(90deg, rgba(59,130,246,0.25), rgba(59,130,246,0.05));
  color: #fff;
}

.content {
  padding: 18px 22px;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.breadcrumb {
  color: var(--muted);
  font-size: 13px;
}

.page-title {
  font-size: 22px;
  font-weight: 800;
}

.user {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #3b82f6;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 800;
}

.page-body {
  display: grid;
  gap: 14px;
}

@media (max-width: 960px) {
  .shell { grid-template-columns: 1fr; }
  .side { display: none; }
  .topbar { flex-direction: column; gap: 10px; align-items: flex-start; }
}

@media (max-width: 768px) {
  .login-panel { grid-template-columns: 1fr; }
}
</style>
