<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="brand-icon">验</div>
        <div>
          <h1>装修验收跟踪系统</h1>
          <p>住宅地下室与裙楼公区一体化验收</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="openLoginConfirm">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="login-actions">
          <button type="button" class="ghost" @click="openTip('系统支持统一账户登录与分角色授权。')">
            登录说明
          </button>
          <button type="submit" class="primary">登录</button>
        </div>
      </form>
    </div>

    <div v-if="modal.visible" class="modal-overlay">
      <div class="modal-card" role="dialog" aria-modal="true">
        <header class="modal-header">
          <h3>{{ modal.title }}</h3>
          <button class="icon-button" @click="closeModal">×</button>
        </header>
        <div class="modal-body">
          <p v-if="modal.type === 'tip'">{{ modal.message }}</p>
          <div v-else class="confirm-body">
            <p>即将以以下信息进入系统：</p>
            <ul>
              <li>账号：{{ form.account }}</li>
              <li>角色：项目验收管理员</li>
              <li>区域：地下室 + 裙楼公区</li>
            </ul>
          </div>
        </div>
        <footer class="modal-footer">
          <button class="ghost" @click="closeModal">取消</button>
          <button class="primary" v-if="modal.type === 'confirm'" @click="confirmLogin">确认进入</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  account: 'manager01',
  password: ''
})

const modal = reactive({
  visible: false,
  title: '',
  message: '',
  type: 'tip'
})

const openTip = (message) => {
  modal.visible = true
  modal.title = '登录说明'
  modal.message = message
  modal.type = 'tip'
}

const openLoginConfirm = () => {
  modal.visible = true
  modal.title = '登录确认'
  modal.message = ''
  modal.type = 'confirm'
}

const closeModal = () => {
  modal.visible = false
}

const confirmLogin = () => {
  modal.visible = false
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fb, #e8f1ff);
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  width: min(420px, 100%);
  box-shadow: 0 30px 60px rgba(37, 99, 235, 0.15);
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
}

.brand h1 {
  margin: 0;
  font-size: 20px;
}

.brand p {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 13px;
  color: #334155;
  gap: 8px;
}

input {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  font-size: 14px;
}

.login-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.primary,
.ghost {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
  flex: 1;
}

.ghost {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #334155;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal-card {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.2);
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
}

.modal-body {
  padding: 20px;
  color: #334155;
  font-size: 14px;
}

.modal-body ul {
  padding-left: 18px;
}

.modal-footer {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
}

.icon-button {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}
</style>
