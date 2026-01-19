<template>
  <div class="app-shell">
    <div v-if="!loggedIn" class="login-screen">
      <div class="login-card">
        <div class="login-header">
          <h1>地理信息管理系统</h1>
          <p>统一身份认证入口</p>
        </div>
        <form class="login-form" @submit.prevent="handleLogin">
          <label>
            账号
            <input v-model="loginForm.username" type="text" placeholder="请输入账号" required />
          </label>
          <label>
            密码
            <input v-model="loginForm.password" type="password" placeholder="请输入密码" required />
          </label>
          <label>
            登录角色
            <select v-model="loginForm.role">
              <option>数据管理员</option>
              <option>分析专员</option>
              <option>可视化工程师</option>
              <option>指挥调度员</option>
            </select>
          </label>
          <button class="primary" type="submit">登录</button>
        </form>
      </div>
    </div>

    <div v-else class="main-layout">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-icon">GIS</div>
          <div>
            <h2>地理信息管理</h2>
            <span>五大功能模块</span>
          </div>
        </div>
        <nav class="menu">
          <router-link to="/capture">数据采集与输入</router-link>
          <router-link to="/management">数据存储与管理</router-link>
          <router-link to="/analysis">数据分析与处理</router-link>
          <router-link to="/visualization">可视化与展示</router-link>
          <router-link to="/decision">应用与决策支持</router-link>
        </nav>
      </aside>
      <section class="content-area">
        <header class="topbar">
          <div class="status">
            <span class="dot"></span>
            <span>在线：{{ loginForm.role }}</span>
          </div>
          <div class="actions">
            <button class="secondary" type="button" @click="openInfo('系统公告', '当前系统已连接 8 个数据源，状态正常。')">公告</button>
            <button class="primary" type="button" @click="openInfo('退出确认', '是否要结束当前会话？')">退出</button>
          </div>
        </header>
        <div class="content-window">
          <router-view />
        </div>
      </section>
    </div>

    <BaseModal :show="modal.open" :title="modal.title" @close="modal.open = false">
      <div v-if="modal.type === 'progress'" class="modal-progress">
        <p>{{ modal.message }}</p>
        <div class="progress-track">
          <div class="progress-bar" :style="{ width: modal.progress + '%' }"></div>
        </div>
        <small>当前完成度：{{ modal.progress }}%</small>
      </div>
      <div v-else>
        <p>{{ modal.message }}</p>
      </div>
      <template #footer>
        <button class="secondary" type="button" @click="modal.open = false">关闭</button>
        <button class="primary" type="button" @click="modal.open = false">确认</button>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import BaseModal from './components/BaseModal.vue';

const loggedIn = ref(false);
const loginForm = reactive({
  username: '',
  password: '',
  role: '数据管理员'
});

const modal = reactive({
  open: false,
  title: '',
  message: '',
  type: 'info',
  progress: 0
});

const handleLogin = () => {
  modal.open = true;
  modal.title = '登录验证';
  modal.message = '正在进行身份校验，请稍候...';
  modal.type = 'progress';
  modal.progress = 78;
  setTimeout(() => {
    modal.open = false;
    loggedIn.value = true;
  }, 600);
};

const openInfo = (title, message) => {
  modal.open = true;
  modal.title = title;
  modal.message = message;
  modal.type = 'info';
  modal.progress = 0;
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: #f5f7fb;
}

.login-screen {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #dbeafe, #eff6ff);
}

.login-card {
  width: min(420px, 90vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.12);
}

.login-header h1 {
  font-size: 24px;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
  margin-bottom: 24px;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  color: #475569;
  font-size: 14px;
}

.login-form input,
.login-form select {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.main-layout {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 240px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.brand h2 {
  font-size: 18px;
}

.brand span {
  color: #64748b;
  font-size: 12px;
}

.menu {
  display: grid;
  gap: 10px;
}

.menu a {
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  color: #1f2a37;
  font-size: 14px;
  border: 1px solid transparent;
}

.menu a.router-link-active {
  border-color: #93c5fd;
  background: #e0f2fe;
  color: #1d4ed8;
  font-weight: 600;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 28px;
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #22c55e;
}

.actions {
  display: flex;
  gap: 12px;
}

.primary {
  background: #2563eb;
  border: none;
  color: #fff;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.secondary {
  background: #e2e8f0;
  border: none;
  color: #1f2a37;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
}

.content-window {
  padding: 24px 28px 40px;
}

.modal-progress {
  display: grid;
  gap: 12px;
}

.progress-track {
  width: 100%;
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #2563eb);
}

@media (max-width: 1024px) {
  .main-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }
}
</style>
