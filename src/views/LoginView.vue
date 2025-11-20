<template>
  <section class="login-shell">
    <div class="login-panel">
      <div class="hero">
        <h1>AI 驱动的智能推荐系统</h1>
        <p>连接用户洞察、算法引擎与实时决策，打造端到端推荐体验。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          邮箱
          <input v-model="form.email" type="email" required placeholder="team@company.com" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="请输入密码" />
        </label>
        <button type="submit">进入控制台</button>
      </form>
    </div>
  </section>
  <BaseModal
    v-model:open="showModal"
    title="欢迎回来"
    @confirm="confirmLogin"
  >
    <p>凭据校验成功，即将跳转到智能推荐指挥中心。</p>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const showModal = ref(false)
const form = reactive({
  email: '',
  password: ''
})

const handleLogin = () => {
  if (form.email && form.password) {
    showModal.value = true
  }
}

const confirmLogin = () => {
  showModal.value = false
  router.push('/dashboard')
}
</script>

<style scoped>
.login-shell {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-panel {
  width: min(960px, 96vw);
  display: flex;
  gap: 2rem;
  background: #fff;
  border-radius: 28px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
}

.hero {
  flex: 1.2;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #111827;
}

.hero h1 {
  font-size: clamp(1.9rem, 3vw, 2.8rem);
}

.hero p {
  color: #6b7280;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  color: #6b7280;
}

input {
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 0.8rem 1rem;
  font-size: 1rem;
}

button {
  margin-top: 1rem;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 0.9rem;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .login-panel {
    flex-direction: column;
    padding: 2rem;
  }
}
</style>
