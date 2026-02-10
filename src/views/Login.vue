<template>
  <div class="login-page">
    <div class="card login-card">
      <h1>AI图像生成与资源管理系统</h1>
      <p>请输入账号信息以继续。</p>
      <div class="form-grid">
        <div class="full">
          <label>账号</label>
          <input v-model="form.username" placeholder="admin" />
        </div>
        <div class="full">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="123456" />
        </div>
      </div>
      <div class="toolbar">
        <button class="primary" @click="login">登录</button>
        <button class="ghost" @click="fill">填充演示账号</button>
      </div>
    </div>

    <ModalDialog :visible="showMsg" title="登录提示" @close="showMsg = false" @confirm="showMsg = false">
      <p>{{ message }}</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const showMsg = ref(false)
const message = ref('')
const form = reactive({ username: '', password: '' })

const fill = () => {
  form.username = 'admin'
  form.password = '123456'
}

const login = () => {
  if (!form.username || !form.password) {
    message.value = '请输入账号和密码。'
    showMsg.value = true
    return
  }
  localStorage.setItem('auth-token', `token-${Date.now()}`)
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #e7f0ff, #f8fbff);
  padding: 16px;
}
.login-card { width: min(520px, 100%); }
h1 { margin: 0 0 6px; font-size: 28px; }
p { color: #4b5563; }
label { display: block; margin-bottom: 6px; }
</style>
