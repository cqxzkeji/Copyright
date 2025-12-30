<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="banner">
        <h1>柔性车间作业调度</h1>
        <p>基于粒子群算法的排产优化系统</p>
      </div>
      <form class="form" @submit.prevent="doLogin">
        <label>
          用户名
          <input v-model="form.username" required placeholder="planner@factory" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="••••••" />
        </label>
        <button class="primary-btn" type="submit">登录</button>
      </form>
      <div class="tips">
        <span>支持单点登录、账户授权、操作审计。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: 'planner', password: '123456' })

const doLogin = () => {
  router.push('/main')
}
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e0e7ff, #f1f5f9);
  padding: 24px;
}

.login-card {
  width: min(520px, 100%);
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(99, 102, 241, 0.2);
  border: 1px solid #e0e7ff;
}

.banner h1 {
  margin: 0;
  color: #312e81;
}

.banner p {
  margin: 4px 0 12px 0;
  color: #475569;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

label {
  display: flex;
  flex-direction: column;
  color: #475569;
  font-weight: 600;
}

input {
  margin-top: 6px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  font-size: 15px;
}

.primary-btn {
  align-self: flex-start;
  padding-inline: 20px;
}

.tips {
  margin-top: 12px;
  color: #64748b;
  font-size: 13px;
}
</style>
