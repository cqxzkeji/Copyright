<template>
  <div class="app-shell">
    <section v-if="!isAuthenticated" class="auth-panel">
      <div class="auth-card">
        <h1>数字内容版权管理系统</h1>
        <p>请输入账户信息以启动平台。</p>
        <form class="auth-form" @submit.prevent="handleLogin">
          <label>
            账号
            <input v-model="loginForm.username" placeholder="admin" required />
          </label>
          <label>
            密码
            <input v-model="loginForm.password" type="password" placeholder="••••••" required />
          </label>
          <button type="submit">登录</button>
        </form>
      </div>
    </section>

    <section v-else class="workspace">
      <aside class="navigation">
        <div class="user-card">
          <h2>{{ greeting }}</h2>
          <p>请选择需要操作的功能模块。</p>
        </div>
        <nav class="nav-grid">
          <button v-for="item in routes" :key="item.path" @click="navigate(item.path)">
            {{ item.label }}
          </button>
          <button class="secondary" @click="triggerProgress">查看处理进度</button>
          <button class="ghost" @click="showSupport">联系客服</button>
        </nav>
      </aside>
      <main class="content-panel">
        <header class="content-header">
          <h1>{{ currentTitle }}</h1>
          <button @click="openNotifications">查看提醒</button>
        </header>
        <section class="content-body">
          <RouterView />
        </section>
      </main>
    </section>

    <div v-if="progressModal.visible" class="modal-mask" @click.self="progressModal.visible = false">
      <div class="modal-window">
        <h3>任务处理进度</h3>
        <p>{{ progressModal.message }}</p>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: progressModal.percent + '%' }"></div>
        </div>
        <p class="progress-number">{{ progressModal.percent }}%</p>
        <button style="margin-top: 1rem" @click="progressModal.visible = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useRouter, useRoute, RouterView } from 'vue-router';

const router = useRouter();
const route = useRoute();
const isAuthenticated = ref(false);
const loginForm = reactive({ username: '', password: '' });
const progressModal = reactive({ visible: false, percent: 72, message: '内容分发加密处理中' });

const routes = [
  { path: '/registration', label: '内容注册与管理' },
  { path: '/protection', label: '版权保护与监控' },
  { path: '/licensing', label: '许可与授权管理' },
  { path: '/transactions', label: '内容交易与转让' },
  { path: '/analytics', label: '数据分析与报告' }
];

const greeting = computed(() => `欢迎回来，${loginForm.username || '管理员'}`);
const currentTitle = computed(() => {
  const match = routes.find((item) => item.path === route.path);
  return match ? match.label : '请选择功能模块';
});

function handleLogin() {
  if (loginForm.username && loginForm.password) {
    isAuthenticated.value = true;
    router.push('/registration');
  } else {
    window.alert('请填写完整账号信息');
  }
}

function navigate(path) {
  router.push(path);
}

function triggerProgress() {
  progressModal.percent = Math.floor(50 + Math.random() * 50);
  progressModal.message = '后台任务实时同步中';
  progressModal.visible = true;
}

function showSupport() {
  window.alert('客服在线：workflows@drm.cn\n响应时间 09:00-18:00');
}

function openNotifications() {
  window.alert('提醒：今日有 2 条授权即将到期，请及时续约。');
}
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
}

.auth-panel,
.workspace {
  flex: 1;
  display: flex;
}

.auth-panel {
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  background: rgba(255, 255, 255, 0.9);
  padding: 2.5rem;
  border-radius: 24px;
  width: min(420px, 100%);
  box-shadow: 0 30px 70px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.workspace {
  padding: 1.5rem;
  gap: 1.5rem;
}

.navigation {
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.user-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.15);
}

.nav-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.nav-grid .secondary {
  background: #10b981;
}

.nav-grid .ghost {
  background: #111827;
}

.content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 28px;
  padding: 1.5rem;
  box-shadow: 0 25px 80px rgba(15, 23, 42, 0.18);
}

.content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
}

.content-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 1.25rem;
}

.progress-number {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: right;
}

@media (max-width: 960px) {
  .workspace {
    flex-direction: column;
  }

  .navigation {
    flex-basis: auto;
  }
}
</style>
