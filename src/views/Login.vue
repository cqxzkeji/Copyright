<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">ARM</div>
        <div>
          <h1>自适应多维协同机器臂</h1>
          <p>精准控制软件 · 安全接入</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openLoginModal">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          访问域
          <select v-model="form.zone">
            <option>研发中心</option>
            <option>制造车间</option>
            <option>远程实验室</option>
          </select>
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
    </div>

    <Modal v-if="showModal" title="登录确认" @close="showModal = false" @confirm="confirmLogin">
      <p>请确认当前账户登录信息，并填写动态令牌。</p>
      <div class="modal-grid">
        <label>
          登录账号
          <input v-model="form.username" type="text" />
        </label>
        <label>
          动态令牌
          <input v-model="form.token" type="text" placeholder="6位动态码" />
        </label>
        <label>
          安全模式
          <select v-model="form.security">
            <option>标准防护</option>
            <option>增强防护</option>
          </select>
        </label>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Modal from '../components/Modal.vue'

const router = useRouter()
const showModal = ref(false)
const form = reactive({
  username: '',
  password: '',
  zone: '研发中心',
  token: '',
  security: '标准防护'
})

const openLoginModal = () => {
  showModal.value = true
}

const confirmLogin = () => {
  showModal.value = false
  router.push('/main/device')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc 60%, #eef2ff);
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.15);
  width: min(480px, 90vw);
  display: grid;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #2563eb;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.primary {
  margin-top: 8px;
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  cursor: pointer;
}

.modal-grid {
  display: grid;
  gap: 12px;
}
</style>
