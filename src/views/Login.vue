<template>
  <div class="login-page">
    <div class="panel">
      <div class="panel__intro">
        <p class="eyebrow">智能驱控式精准操控</p>
        <h1>机器臂控制系统</h1>
        <p class="muted">连接、校准、执行、监控，打造一体化柔性作业调度中心。</p>
      </div>
      <form class="form" @submit.prevent="submit">
        <label>
          <span>账号</span>
          <input v-model="form.username" required placeholder="请输入工号或邮箱" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" required type="password" placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button type="submit">登录</button>
          <button type="button" class="ghost" @click="quickLogin">一键演示</button>
        </div>
        <p class="muted tiny">* 登录后即可切换到工作台，所有模块均可实时体验。</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const submit = () => {
  if (!form.username || !form.password) return
  localStorage.setItem('smart-arm-auth', 'true')
  router.push('/main/arm-control')
}

const quickLogin = () => {
  form.username = 'arm.operator'
  form.password = 'demo1234'
  submit()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 32px 16px;
  background: radial-gradient(circle at 10% 20%, rgba(45, 156, 219, 0.15), transparent 35%),
    radial-gradient(circle at 80% 0%, rgba(42, 191, 119, 0.2), transparent 45%),
    #f6f8fb;
}

.panel {
  width: min(960px, 96vw);
  background: var(--surface);
  border-radius: 18px;
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  box-shadow: var(--shadow);
  border: 1px solid var(--border);
}

.panel__intro h1 {
  margin: 8px 0;
  font-size: clamp(24px, 4vw, 30px);
}

.eyebrow {
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--primary);
  font-weight: 700;
}

.muted {
  color: var(--muted);
}

.tiny {
  font-size: 12px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #1b2a3c;
  font-weight: 600;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #f9fbff;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  flex: 1;
  border: none;
  border-radius: 12px;
  padding: 12px 14px;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(135deg, var(--primary), var(--primary-strong));
  color: #fff;
  box-shadow: 0 12px 24px rgba(45, 156, 219, 0.25);
}

button.ghost {
  background: #eef2f7;
  color: #1b2a3c;
  box-shadow: none;
  border: 1px solid var(--border);
}
</style>
