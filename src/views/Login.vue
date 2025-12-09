<template>
  <div class="login-wrap">
    <div class="login-card card">
      <h1>矿物基磷吸附剂平台</h1>
      <p class="muted">请登录后进入功能模块</p>
      <form @submit.prevent="handleLogin" class="grid" style="gap: 0.8rem;">
        <div class="form-group">
          <label>用户名</label>
          <input v-model="username" required placeholder="输入实验员账号" />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="password" required placeholder="输入密码" />
        </div>
        <button class="btn" type="submit">登录</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (username.value && password.value) {
    error.value = ''
    router.push('/app/raw-material')
  } else {
    error.value = '请填写完整的用户名和密码'
  }
}
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, rgba(82, 200, 255, 0.15), transparent 40%),
    radial-gradient(circle at 80% 0%, rgba(43, 123, 255, 0.2), transparent 35%), var(--bg);
  padding: 1rem;
}

.login-card {
  width: min(420px, 100%);
  text-align: center;
}

h1 {
  margin: 0 0 0.35rem 0;
}

.muted {
  color: #6f7b95;
  margin-bottom: 1rem;
}

.error {
  color: #d12a2a;
  margin-top: 0.35rem;
}
</style>
