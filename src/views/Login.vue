<template>
  <div class="login">
    <div class="login-card">
      <div class="brand">
        <div class="logo">智信</div>
        <div>
          <h1>智信商标与版权管理软件</h1>
          <p>统一管理商标与版权资产</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          登录角色
          <select v-model="form.role" required>
            <option value="管理员">管理员</option>
            <option value="审核员">审核员</option>
            <option value="运营">运营</option>
          </select>
        </label>
        <button type="submit">登录并进入系统</button>
      </form>
      <div class="login-hints">
        <span>安全提醒：开启双因素认证可提升账户安全。</span>
        <span>今日待处理事项：12条</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  username: '',
  password: '',
  role: '管理员'
})

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/trademark')
  }
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef2ff, #fef9f9);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #4f46e5, #60a5fa);
  color: #fff;
  font-weight: 700;
}

.brand h1 {
  font-size: 18px;
  margin-bottom: 6px;
}

.brand p {
  font-size: 12px;
  color: #6b7280;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #f8fafc;
}

button {
  border: none;
  padding: 12px;
  background: #4f46e5;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
}

.login-hints {
  font-size: 12px;
  color: #64748b;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
