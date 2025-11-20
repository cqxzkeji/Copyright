<template>
  <div class="app-shell">
    <div v-if="!isLoggedIn" class="login-overlay">
      <div class="login-card">
        <h1>数字文化创意策划支持平台</h1>
        <p>以可视化方式管理创意、资源和项目。</p>
        <form class="login-form" @submit.prevent="handleLogin">
          <label>
            账号 / 邮箱
            <input v-model="loginForm.account" type="text" placeholder="creative@team.cn" />
          </label>
          <label>
            密码
            <input v-model="loginForm.password" type="password" placeholder="••••••" />
          </label>
          <button type="submit">进入平台</button>
        </form>
        <p v-if="loginError" class="login-error">{{ loginError }}</p>
      </div>
    </div>

    <div v-else class="platform-layout">
      <aside class="nav-panel">
        <div class="profile">
          <div class="avatar">策</div>
          <div>
            <p class="name">策划工作台</p>
            <small>Creative Ops</small>
          </div>
        </div>
        <nav>
          <RouterLink
            v-for="module in modules"
            :key="module.path"
            :to="module.path"
            class="nav-link"
            active-class="active"
          >
            <div>
              <p>{{ module.name }}</p>
              <small>{{ module.desc }}</small>
            </div>
          </RouterLink>
        </nav>
      </aside>

      <section class="content-panel">
        <header class="top-bar">
          <div>
            <h2>欢迎回来，{{ loginForm.account || '策划专员' }}</h2>
            <p>选择左侧模块即可加载对应工作区。</p>
          </div>
          <div class="top-actions">
            <button @click="openGlobalModal('版本提示', '本平台集成了创意策划、资源和项目管理等功能，全部在此一站式完成。')">
              查看提示
            </button>
            <button @click="openGlobalModal('通知', '最新的文化节项目已添加至项目管理模块，请及时跟进。')">
              查看通知
            </button>
          </div>
        </header>
        <main class="content-window">
          <RouterView />
        </main>
      </section>
    </div>

    <div v-if="globalModal.visible" class="modal-mask">
      <div class="modal-box">
        <h3>{{ globalModal.title }}</h3>
        <p>{{ globalModal.message }}</p>
        <button @click="globalModal.visible = false">我已知晓</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const isLoggedIn = ref(false);
const loginForm = reactive({ account: '', password: '' });
const loginError = ref('');

const modules = [
  { name: '内容创意与策划', path: '/creative-planning', desc: '灵感收集 / 方案输出' },
  { name: '文化资源管理', path: '/resource-management', desc: '资源台账 / 调用记录' },
  { name: '项目管理与跟进', path: '/project-management', desc: '里程碑 / 进度掌握' },
  { name: '数据分析与优化', path: '/data-analysis', desc: '传播 / 受众分析' },
  { name: '创意展示与反馈', path: '/feedback-display', desc: '互动 / 反馈汇总' }
];

const globalModal = reactive({ visible: false, title: '', message: '' });

const handleLogin = () => {
  if (!loginForm.account || !loginForm.password) {
    loginError.value = '请输入完整账号和密码。';
    return;
  }
  loginError.value = '';
  isLoggedIn.value = true;
};

const openGlobalModal = (title, message) => {
  globalModal.title = title;
  globalModal.message = message;
  globalModal.visible = true;
};
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  background: linear-gradient(120deg, #f9fbff, #edf2ff);
  color: #1f2a44;
}

.login-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #dde7ff, rgba(255, 255, 255, 0.8));
  padding: 2rem;
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 25px 55px rgba(31, 42, 68, 0.15);
}

.login-card h1 {
  margin: 0 0 0.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.login-form label {
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  color: #4a5674;
}

.login-form input {
  margin-top: 0.35rem;
  padding: 0.75rem 0.9rem;
  border-radius: 0.6rem;
  border: 1px solid #cfd8f3;
  font-size: 1rem;
}

.login-form button {
  padding: 0.85rem;
  border: none;
  border-radius: 0.6rem;
  background: linear-gradient(120deg, #4f7bff, #7f5dff);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.login-error {
  color: #d14343;
  margin-top: 1rem;
}

.platform-layout {
  display: flex;
  min-height: 100vh;
}

.nav-panel {
  flex: 0 0 300px;
  padding: 2rem 1.5rem;
  background: #121a2c;
  color: #f4f6ff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.profile {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: #4f7bff;
  font-weight: 700;
}

.nav-link {
  display: block;
  padding: 1rem;
  border-radius: 0.9rem;
  text-decoration: none;
  color: inherit;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  transition: background 0.3s ease, transform 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

.content-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.top-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e9f2;
}

.top-actions {
  display: flex;
  gap: 0.75rem;
}

.top-actions button {
  border: none;
  padding: 0.75rem 1.1rem;
  border-radius: 0.75rem;
  background: #fff;
  box-shadow: 0 8px 25px rgba(79, 123, 255, 0.15);
  color: #4f52ff;
  cursor: pointer;
}

.content-window {
  flex: 1;
  margin-top: 1.5rem;
  background: #fff;
  padding: 1.5rem;
  border-radius: 1.2rem;
  box-shadow: 0 15px 40px rgba(20, 35, 70, 0.08);
  overflow: auto;
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(9, 13, 30, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-box {
  background: #fff;
  padding: 1.5rem;
  border-radius: 1rem;
  width: min(420px, 100%);
  text-align: center;
}

.modal-box button {
  margin-top: 1rem;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 0.8rem;
  background: #4f7bff;
  color: #fff;
  cursor: pointer;
}

@media (max-width: 960px) {
  .platform-layout {
    flex-direction: column;
  }

  .nav-panel {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-link {
    flex: 1 1 45%;
  }
}
</style>
