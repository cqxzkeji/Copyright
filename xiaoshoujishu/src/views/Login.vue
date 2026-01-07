<template>
  <div class="login">
    <div class="card">
      <h1>优特钢销售技术标准系统</h1>
      <p>登录后进入五大功能模块总览</p>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" type="text" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="remember">
          <input type="checkbox" v-model="form.remember" />
          记住账号信息
        </label>
        <button class="submit" type="submit">进入系统</button>
      </form>
      <div class="tips">默认账号：admin / 123456</div>
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
  remember: true
})

const handleLogin = () => {
  router.push('/app/sales')
}
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #f8fafc);
}

.card {
  background: #ffffff;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  width: min(420px, 92vw);
  text-align: center;
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

p {
  color: #64748b;
  margin: 0 0 24px;
}

.form {
  display: grid;
  gap: 16px;
  text-align: left;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

input[type='text'],
input[type='password'] {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
}

.submit {
  background: #2563eb;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
}

.tips {
  margin-top: 16px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
