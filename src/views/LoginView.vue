<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="login">
      <h1>交互式数据可视化与商业智能分析平台</h1>
      <p>请输入账号信息后进入系统</p>
      <label>账号<input v-model="form.username" required placeholder="admin" /></label>
      <label>密码<input v-model="form.password" type="password" required placeholder="••••••" /></label>
      <button class="btn" type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const login = () => {
  if (form.username && form.password) {
    router.push('/app')
  }
}
</script>
