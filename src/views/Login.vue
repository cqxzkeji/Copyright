<template>
  <div class="login-page">
    <div class="login-card">
      <h1>非遗劳动多形态内容创作聚合系统</h1>
      <p>请登录后进入系统管理平台</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/main')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(140deg, #dbeafe, #fef3c7);
  display: grid;
  place-items: center;
  padding: 16px;
}
.login-card {
  width: min(420px, 96vw);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 18px 34px rgba(30, 41, 59, 0.15);
  padding: 24px;
}
h1 { font-size: 22px; color: #1e3a8a; margin-bottom: 6px; }
p { color: #475569; margin-bottom: 16px; }
form { display: flex; flex-direction: column; gap: 12px; }
label { display: flex; flex-direction: column; gap: 6px; color: #334155; font-weight: 600; }
input {
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  padding: 10px;
}
button {
  margin-top: 8px;
  border: none;
  border-radius: 10px;
  background: #2563eb;
  color: #fff;
  padding: 10px;
  cursor: pointer;
}
</style>
