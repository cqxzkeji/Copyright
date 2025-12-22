<template>
  <div class="login-page">
    <div class="login-card">
      <h1>农产品直播带货运营管理系统</h1>
      <p>请使用运营账号登录后台，进入系统主页。</p>
      <form @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="admin@agri.com" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="btn" type="submit">登录</button>
      </form>
    </div>
  </div>

  <BaseModal :show="showLoginModal" title="正在登录" @close="showLoginModal = false">
    <p>系统正在验证账号信息，请稍候。</p>
    <div class="progress-wrap">
      <div class="progress-bar" :style="{ width: loginProgress + '%' }"></div>
    </div>
    <template #footer>
      <button class="btn ghost" type="button" @click="showLoginModal = false">取消</button>
      <button class="btn" type="button" @click="enterSystem">进入系统</button>
    </template>
  </BaseModal>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const showLoginModal = ref(false)
const loginProgress = ref(68)

const form = reactive({
  username: 'admin@agri.com',
  password: ''
})

const openLoginModal = () => {
  loginProgress.value = 68
  showLoginModal.value = true
}

const enterSystem = () => {
  showLoginModal.value = false
  router.push('/main/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f0fdf4, #e0f2fe);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  padding: 32px;
  border-radius: 18px;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-card h1 {
  margin: 0;
  font-size: 22px;
  color: #16a34a;
}

.login-card form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-card label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #6b7280;
}

.login-card input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}
</style>
