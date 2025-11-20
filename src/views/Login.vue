<template>
  <div class="login-page">
    <div class="login-card">
      <h1>智能广告设计与创意管理系统</h1>
      <p>请登录以进入多模块智能工作台</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>
          用户名
          <input v-model="username" type="text" placeholder="例如：creative.manager" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit">进入系统</button>
      </form>
      <p class="hint">系统为演示模式，任意用户名密码均可体验。</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = () => {
  if (username.value && password.value) {
    router.push('/main')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at top, #1f6feb, #0f172a);
}

.login-card {
  background: #fff;
  padding: 48px;
  border-radius: 32px;
  width: min(480px, 90%);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card h1 {
  font-size: 28px;
  color: #0f172a;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #4b5563;
  gap: 6px;
}

input {
  border: 1px solid #d1d5db;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 15px;
}

button {
  border: none;
  border-radius: 18px;
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
  font-size: 16px;
  padding: 14px;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-1px);
}

.hint {
  font-size: 12px;
  color: #9ca3af;
}
</style>
