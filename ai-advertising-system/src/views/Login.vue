<template>
  <div class="login-page">
    <div class="login-card">
      <h1>AI全链路广告智能系统</h1>
      <p class="subtitle">请登录以开始创意设计与智能投放</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="输入工号/邮箱" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <button type="submit">登录系统</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (!form.username || !form.password) return;
  router.push('/main/creative-design');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #fef3c7);
}

.login-card {
  width: min(400px, 90%);
  background: #fff;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.2);
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: center;
}

.subtitle {
  color: #6b7280;
  margin: 0;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  text-align: left;
  font-weight: 600;
  color: #374151;
}

input {
  margin-top: 6px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  font-size: 0.95rem;
}

button {
  margin-top: 8px;
  padding: 12px 16px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #14b8a6);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}
</style>
