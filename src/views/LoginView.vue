<template>
  <div class="login-page">
    <div class="login-card">
      <div>
        <p class="login-subtitle">农产品供应链调度与追溯系统</p>
        <h1>欢迎登录</h1>
      </div>
      <form @submit.prevent="handleLogin">
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
          <select v-model="form.role">
            <option value="运营中心">运营中心</option>
            <option value="仓储主管">仓储主管</option>
            <option value="质检员">质检员</option>
            <option value="物流协调员">物流协调员</option>
          </select>
        </label>
        <button class="btn" type="submit">进入系统</button>
      </form>
      <div class="login-foot">
        <span>亮色界面 · 自适应布局</span>
        <span>实时调度 · 全链追溯</span>
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
  role: '运营中心'
})

const handleLogin = () => {
  router.push('/source-records')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #eef3ff, #f8fbff);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(47, 128, 237, 0.18);
  display: grid;
  gap: 24px;
}

.login-card h1 {
  font-size: 28px;
  margin-top: 8px;
}

.login-subtitle {
  color: #6b7a99;
  font-size: 14px;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #4a5a78;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d7e3f3;
  background: #f5f8fe;
}

.login-foot {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #7a879f;
}

@media (max-width: 480px) {
  .login-foot {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
