<template>
  <div class="login-page">
    <div class="login-card card">
      <h2>电力巡检无人机移动作业车多机协同任务规划与控制系统</h2>
      <form @submit.prevent="login">
        <label>账号</label>
        <input v-model="form.username" placeholder="请输入账号" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" required />
        <button class="btn-primary submit">登录系统</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const login = () => {
  if (form.username && form.password) {
    router.push('/system')
  }
}
</script>

<style scoped>
.login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px; }
.login-card { width: min(560px, 95vw); }
form { display: grid; gap: 10px; }
.submit { margin-top: 8px; height: 42px; }
</style>
