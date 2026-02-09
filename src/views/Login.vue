<template>
  <div class="login-page">
    <form class="card login-box" @submit.prevent="login">
      <h2>电力无人机巡检数据处理平台</h2>
      <p>请输入账号密码登录系统</p>
      <label>账号<input v-model="form.user" required placeholder="admin" /></label>
      <label>密码<input v-model="form.password" type="password" required placeholder="123456" /></label>
      <button class="btn primary">登录</button>
    </form>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const form = reactive({ user: '', password: '' })
const login = () => {
  localStorage.setItem('token', `${form.user}-token`)
  router.push('/platform/collection')
}
</script>

<style scoped>
.login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(160deg,#e0ecff,#f9fcff)}
.login-box{width:min(420px,92vw);display:grid;gap:10px}
h2{margin:0} p{margin:0 0 8px;color:#64748b}
</style>
