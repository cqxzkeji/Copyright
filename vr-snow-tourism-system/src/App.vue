<template>
  <div class="app-shell">
    <section v-if="!isLoggedIn" class="login-panel">
      <div class="login-card section-card" style="max-width:420px;width:100%;align-self:center;">
        <h2 style="margin:0;">VR冰雪旅游系统登录</h2>
        <p style="margin:0;color:#64748b;">请输入运营账号进入主控台</p>
        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:1rem;margin-top:1rem;">
          <label>
            <span>用户名</span>
            <input v-model="form.username" placeholder="例如 admin" required />
          </label>
          <label>
            <span>口令</span>
            <input v-model="form.password" type="password" placeholder="请输入密码" required />
          </label>
          <button type="submit" style="width:100%;padding:0.8rem;font-size:1rem;">进入冰雪指挥舱</button>
        </form>
        <div style="margin-top:1rem;text-align:center;">
          <small>账号受安全监控，禁止泄露</small>
        </div>
      </div>
    </section>

    <section v-else class="dashboard">
      <aside class="sidebar">
        <div class="brand">
          <h1>VR Snow</h1>
          <p>沉浸式交互体验</p>
        </div>
        <nav>
          <router-link v-for="item in navItems" :key="item.path" :to="item.path" class="nav-item">
            <span>{{ item.icon }}</span>
            {{ item.label }}
          </router-link>
        </nav>
        <div class="sidebar-actions">
          <button @click="openSystemProgress">系统运行体检</button>
          <button style="background:#0ea5e9;margin-top:0.6rem;" @click="showTip = true">操作提示</button>
        </div>
      </aside>

      <main class="content-area">
        <header class="main-header">
          <div>
            <h2 style="margin:0;">欢迎，{{ form.username }}</h2>
            <p style="margin:0;color:#64748b;">选择左侧模块即刻调度体验任务</p>
          </div>
          <div style="display:flex;align-items:center;gap:0.8rem;">
            <button style="background:#f97316;" @click="logout">退出登录</button>
          </div>
        </header>
        <section class="content-window section-card" style="min-height:400px;">
          <router-view />
        </section>
      </main>
    </section>

    <BaseModal :open="showTip" title="操作提示" @close="showTip = false">
      <p>各模块按钮均会触发弹窗或进度提醒，请按提示完成体验任务。</p>
    </BaseModal>

    <BaseModal :open="showMessage" title="系统消息" @close="showMessage = false">
      <p>{{ modalMessage }}</p>
    </BaseModal>

    <BaseModal :open="showProgress" title="体检进度" @close="closeProgress">
      <div style="display:flex;flex-direction:column;gap:1rem;">
        <p>模拟检测渲染引擎、互动链路与云端带宽。</p>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <strong>{{ progress }}%</strong>
      </div>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const form = reactive({ username: '', password: '' });
const isLoggedIn = ref(false);
const showTip = ref(false);
const showMessage = ref(false);
const modalMessage = ref('');
const showProgress = ref(false);
const progress = ref(0);
let progressTimer;

const navItems = [
  { path: '/users', label: '用户管理', icon: '👥' },
  { path: '/scenes', label: '场景展示与体验', icon: '🏔️' },
  { path: '/activities', label: '互动活动', icon: '🎮' },
  { path: '/tour', label: '虚拟导览与学习', icon: '🧭' },
  { path: '/analytics', label: '数据分析与反馈', icon: '📊' }
];

function handleLogin() {
  if (!form.username || !form.password) {
    modalMessage.value = '请输入完整账号信息';
    showMessage.value = true;
    return;
  }
  isLoggedIn.value = true;
  modalMessage.value = '登录成功，已接入VR雪域控制平台';
  showMessage.value = true;
}

function logout() {
  isLoggedIn.value = false;
  form.username = '';
  form.password = '';
  modalMessage.value = '您已退出，请妥善保管账号';
  showMessage.value = true;
}

function openSystemProgress() {
  showProgress.value = true;
  progress.value = 0;
  clearInterval(progressTimer);
  progressTimer = setInterval(() => {
    progress.value += 10;
    if (progress.value >= 100) {
      progress.value = 100;
      clearInterval(progressTimer);
      modalMessage.value = '系统自检通过，互动链路稳定。';
      showMessage.value = true;
    }
  }, 300);
}

function closeProgress() {
  showProgress.value = false;
  clearInterval(progressTimer);
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: stretch;
}

.login-panel {
  display: flex;
  width: 100%;
  justify-content: center;
  padding: 3rem 1rem;
}

.dashboard {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.sidebar {
  width: 260px;
  background: #0f172a;
  color: #f8fafc;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.brand h1 {
  margin: 0;
  font-size: 1.6rem;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.65rem 0.8rem;
  border-radius: 12px;
  text-decoration: none;
  color: inherit;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
}

.nav-item.router-link-active {
  background: #2563eb;
}

.sidebar-actions {
  margin-top: auto;
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-header {
  background: #fff;
  border-radius: 20px;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.content-window {
  flex: 1;
}

@media (max-width: 960px) {
  .dashboard {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .nav-item {
    flex: 1 1 calc(50% - 0.4rem);
  }
}
</style>
