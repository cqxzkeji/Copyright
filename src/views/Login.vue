<template>
  <div class="login-page flex-row">
    <div class="hero flex-column">
      <h1>智能化数据库管理与监控系统</h1>
      <p>一体化管理性能监控、安全审计、故障恢复与数据分析。</p>
      <div class="stats flex-row">
        <div class="stat-card">
          <strong>132</strong>
          <span>已接入实例</span>
        </div>
        <div class="stat-card">
          <strong>99.99%</strong>
          <span>运行稳定性</span>
        </div>
      </div>
    </div>
    <div class="card login-panel flex-column">
      <h2>欢迎回来</h2>
      <p class="muted">请使用管理员账号登录</p>
      <form class="flex-column" @submit.prevent="handleLogin">
        <label>
          <span>账号</span>
          <input v-model="form.username" placeholder="admin" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="••••••" required />
        </label>
        <button class="primary-button" type="submit">登录</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
    <div v-if="showToast" class="modal-backdrop" @click="showToast = false">
      <div class="modal-panel">
        <h3>登录成功</h3>
        <p>正在为您加载控制台...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const error = ref('');
const showToast = ref(false);

const handleLogin = () => {
  if (form.username === 'admin' && form.password === 'admin123') {
    error.value = '';
    showToast.value = true;
    setTimeout(() => {
      showToast.value = false;
      router.push('/dashboard/performance');
    }, 1200);
  } else {
    error.value = '账号或密码错误，请重试。';
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  padding: 3rem;
  gap: 3rem;
  align-items: center;
  justify-content: center;
}

.hero {
  flex: 1;
  gap: 1.5rem;
}

.hero h1 {
  font-size: 2.8rem;
  margin: 0;
}

.hero p {
  color: #475569;
  max-width: 460px;
}

.stats {
  gap: 1.5rem;
}

.stat-card {
  background: rgba(255, 255, 255, 0.8);
  padding: 1.25rem 1.5rem;
  border-radius: 20px;
  min-width: 150px;
  box-shadow: 0 15px 30px rgba(15, 23, 42, 0.08);
}

.stat-card strong {
  font-size: 2rem;
  display: block;
}

.login-panel {
  width: min(400px, 100%);
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
  color: #475569;
}

input {
  padding: 0.9rem 1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
}

form {
  gap: 1rem;
}

.muted {
  color: #94a3b8;
  margin: 0;
}

.error {
  color: #ef4444;
  margin: 0;
}

@media (max-width: 960px) {
  .login-page {
    flex-direction: column;
    padding: 2rem 1.5rem;
  }
}
</style>
