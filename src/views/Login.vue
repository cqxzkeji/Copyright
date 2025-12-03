<template>
  <div class="login-container">
    <div class="login-card">
      <h1>优特钢销售技术标准逆向推导设计系统</h1>
      <p class="tooltip">请使用企业账号登录以加载各功能模块。</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>账号</label>
        <input v-model="form.username" required placeholder="请输入工号或邮箱" />
        <label>密码</label>
        <input v-model="form.password" type="password" required placeholder="请输入密码" />
        <div class="flex-between" style="margin-top: 12px;">
          <label class="remember">
            <input type="checkbox" v-model="form.remember" /> 记住我
          </label>
          <a class="tooltip" href="#" @click.prevent="showReset = true">忘记密码？</a>
        </div>
        <button type="submit" style="margin-top: 16px; width: 100%; justify-content: center;">登录</button>
      </form>
    </div>
    <ModalDialog v-model="showReset" title="找回密码" show-actions @confirm="showReset = false">
      <p class="tooltip">填写邮箱即可收到重置链接。</p>
      <input v-model="resetEmail" placeholder="企业邮箱" />
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const form = reactive({ username: '', password: '', remember: true })
const showReset = ref(false)
const resetEmail = ref('')

const handleLogin = () => {
  router.push('/dashboard/design-input')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 10% 20%, rgba(31, 142, 250, 0.12), transparent 35%),
    radial-gradient(circle at 90% 10%, rgba(74, 217, 145, 0.18), transparent 30%),
    var(--bg);
  padding: 24px;
}

.login-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.16);
  border: 1px solid var(--border);
}

.login-card h1 {
  margin: 0 0 6px 0;
}

.login-form {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}

.remember {
  font-size: 13px;
  color: var(--muted);
}
</style>
