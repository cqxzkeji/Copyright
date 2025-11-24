<template>
  <div class="login-wrapper">
    <form class="login-panel" @submit.prevent="handleLogin">
      <h1>智慧农业管理系统</h1>
      <p class="sub">请使用账号密码登录</p>
      <label>
        <span>账号</span>
        <input v-model="form.username" placeholder="示例：admin" required />
      </label>
      <label>
        <span>密码</span>
        <input type="password" v-model="form.password" placeholder="示例：123456" required />
      </label>
      <button type="submit">登录</button>
      <p class="tips">体验账号：admin / 123456</p>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/');
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, rgba(34, 197, 94, 0.2), transparent),
    #f0f4ff;
}

.login-panel {
  width: min(420px, 90vw);
  background: #fff;
  padding: 2.5rem 3rem;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

h1 {
  font-size: 1.75rem;
}

.sub {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-weight: 600;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 0.6rem 1rem;
}

button {
  margin-top: 0.75rem;
  border: none;
  background: linear-gradient(120deg, #4ade80, #22d3ee);
  color: #fff;
  border-radius: 999px;
  padding: 0.65rem;
  cursor: pointer;
  font-weight: 600;
}

.tips {
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
}
</style>
