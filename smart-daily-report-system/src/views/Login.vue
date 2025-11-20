<template>
  <div class="login-page">
    <section class="login-panel">
      <h1>智能日报系统</h1>
      <p>一站式管理日报录入、审批、统计与提醒</p>

      <form class="login-form" @submit.prevent="login">
        <label>
          账号
          <input v-model="form.username" type="text" required placeholder="输入工号或邮箱" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="输入密码" />
        </label>
        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="form.remember" /> 记住账号
          </label>
          <a href="#">忘记密码?</a>
        </div>
        <button type="submit">登录</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  username: 'manager@smart.com',
  password: '123456',
  remember: true
})

const login = () => {
  if (!form.username || !form.password) return
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #daf0ff, #f2f4ff 40%, #f5f7fb);
  padding: 32px;
}

.login-panel {
  width: min(420px, 100%);
  background: #fff;
  padding: 40px 48px;
  border-radius: 28px;
  box-shadow: 0 30px 80px rgba(31, 58, 147, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-panel h1 {
  margin: 0;
  font-size: 32px;
  color: #1b2852;
}

.login-panel p {
  margin: 0;
  color: #607094;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 16px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  color: #5a6b8a;
  gap: 6px;
}

input[type='text'],
input[type='password'] {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #d9e3f5;
  font-size: 15px;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}

.remember {
  flex-direction: row;
  align-items: center;
  gap: 6px;
}

button {
  margin-top: 12px;
  padding: 12px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(120deg, #306bff, #58c8ff);
  color: #fff;
  font-weight: 600;
  font-size: 16px;
}
</style>
