<template>
  <div class="login-page">
    <div class="login-card">
      <h1>跨境经贸合作信息管理与服务系统</h1>
      <form @submit.prevent="login" class="form-grid">
        <label>
          <span>账号</span>
          <input v-model="account" placeholder="请输入账号" required />
        </label>
        <label>
          <span>密码</span>
          <input type="password" v-model="password" placeholder="请输入密码" required />
        </label>
        <button class="btn" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const account = ref('admin')
const password = ref('123456')
const router = useRouter()

const login = () => {
  localStorage.setItem('cbtm_user', account.value)
  router.push('/main/trade-info')
}
</script>
