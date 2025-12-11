<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="logo">渐变家居</div>
      <h1>登录渐变色家居空间设计辅助系统</h1>
      <p class="muted">使用账户进入设计主界面，解锁渐变色灵感与智能配置。</p>
      <form @submit.prevent="handleLogin" class="grid">
        <label>
          <span>邮箱</span>
          <input v-model="form.email" required type="email" placeholder="designer@example.com" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" required type="password" placeholder="••••••" />
        </label>
        <button class="btn btn-primary" type="submit">进入系统</button>
      </form>
      <p class="hint">登录即表示同意《空间色彩与隐私协议》</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ email: '', password: '' });

const handleLogin = () => {
  router.push('/app');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  background: white;
  border-radius: 18px;
  padding: 32px;
  max-width: 480px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(79, 70, 229, 0.15);
  border: 1px solid #e5e7eb;
}

.logo {
  background: linear-gradient(120deg, #4f46e5, #06b6d4);
  color: white;
  display: inline-flex;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 800;
  margin-bottom: 12px;
}

h1 {
  margin: 0 0 8px;
}

.muted {
  margin: 0 0 18px;
  color: #6b7280;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

form {
  gap: 14px;
}

.btn {
  width: 100%;
  justify-content: center;
}

.hint {
  margin-top: 12px;
  color: #94a3b8;
  font-size: 12px;
}
</style>
