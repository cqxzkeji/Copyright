<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>橡胶制品维护管理助手</h1>
      <p>请使用授权账户登录系统</p>
      <form @submit.prevent="handleLogin">
        <label>
          账户
          <input v-model="form.username" placeholder="维护主管" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="••••••" required />
        </label>
        <button type="submit">进入控制中心</button>
      </form>
      <small>系统将记录关键操作日志以确保可追溯性</small>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #dbeafe, #e2e8f0);
  padding: 20px;
}

.login-card {
  width: min(480px, 90%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15);
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #475569;
  font-weight: 600;
}

input {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 12px;
  font-size: 16px;
}

button {
  border: none;
  border-radius: 999px;
  padding: 14px;
  background: linear-gradient(120deg, #2563eb, #4f46e5);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

small {
  color: #94a3b8;
  text-align: center;
}
</style>
