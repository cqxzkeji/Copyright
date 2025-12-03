<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="hero">
        <h1>优特钢定制销售技术标准管理系统</h1>
        <p>统一管理技术标准、订单履约、质量监控和数据分析，保障销售闭环。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>用户名</label>
        <input v-model="username" placeholder="输入用户名" required />
        <label>密码</label>
        <input v-model="password" type="password" placeholder="输入密码" required />
        <button class="primary-btn" type="submit">登录</button>
        <p class="tip">演示账号任意填写即可登录</p>
      </form>
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
    localStorage.setItem('yutegang-token', 'approved')
    router.push('/main')
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #eef2ff, transparent 40%),
    radial-gradient(circle at 80% 0%, #dbeafe, transparent 40%),
    #f8fafc;
}

.login-panel {
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.15);
  width: min(860px, 95vw);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  border: 1px solid #e5e7eb;
}

.hero h1 {
  margin: 0 0 12px;
  color: #1e3a8a;
}

.hero p {
  margin: 0;
  color: #4b5563;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  font-weight: 600;
  color: #1f2937;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 14px;
}

button {
  margin-top: 8px;
}

.tip {
  color: #6b7280;
  margin: 0;
  font-size: 13px;
}
</style>
