<template>
  <div class="login-page">
    <form class="login-card" @submit.prevent="login">
      <h1>跨境经贸合作信息管理与服务系统</h1>
      <label>
        账号
        <input v-model="account" placeholder="请输入账号" required />
      </label>
      <label>
        密码
        <input v-model="password" type="password" placeholder="请输入密码" required />
      </label>
      <button class="btn" type="submit">登录</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const account = ref('admin')
const password = ref('123456')
const router = useRouter()

const login = () => {
  if (account.value && password.value) {
    sessionStorage.setItem('loggedIn', '1')
    router.push('/main')
  }
}
</script>
