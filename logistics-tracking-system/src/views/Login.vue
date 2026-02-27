<template>
  <main class="login-page">
    <div class="card">
      <h1>物流运输全程追踪与管控软件</h1>
      <p>请输入账号信息以进入主界面</p>
      <form @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" required placeholder="admin" />
        </label>
        <label>
          密码
          <input v-model="form.password" required type="password" placeholder="******" />
        </label>
        <button type="submit">登录</button>
      </form>
      <ModalDialog :visible="showTip" title="登录提示" @close="showTip = false">
        <p>登录成功，正在进入主界面...</p>
      </ModalDialog>
    </div>
  </main>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const showTip = ref(false)
const form = reactive({ username: 'admin', password: '123456' })

const handleLogin = () => {
  showTip.value = true
  setTimeout(() => {
    showTip.value = false
    router.push('/dashboard')
  }, 700)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #ebf6ff, #d8ebff);
}
.card {
  width: min(92vw, 420px);
  background: #fff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 20px 40px rgba(56, 121, 191, 0.2);
}
form {
  display: grid;
  gap: 12px;
}
input {
  width: 100%;
  margin-top: 6px;
  padding: 10px;
  border: 1px solid #c7daf7;
  border-radius: 8px;
}
button {
  margin-top: 8px;
  border: none;
  padding: 11px;
  border-radius: 10px;
  background: linear-gradient(135deg, #2f8cff, #53b8ff);
  color: #fff;
}
</style>
