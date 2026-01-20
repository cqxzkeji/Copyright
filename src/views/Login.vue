<template>
  <div class="login-page">
    <div class="login-card card">
      <h1>纤维增强气凝胶复合材料多尺度设计平台</h1>
      <p>请登录后进入多尺度设计与仿真工作区。</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="工程师账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="remember">
          <input v-model="form.remember" type="checkbox" /> 记住登录状态
        </label>
        <button class="btn" type="submit">进入主界面</button>
      </form>
      <div class="login-footer">
        <span class="badge">版本 V1.0</span>
        <button class="btn ghost" type="button" @click="showTip = true">登录帮助</button>
      </div>
    </div>

    <BaseModal
      v-if="showTip"
      title="登录提示"
      description="示例系统无需真实验证，可直接输入任意账号进入。"
      @close="showTip = false"
      @confirm="showTip = false"
    >
      <p>支持账号、批次、角色三重管理，可在权限中心进行配置。</p>
    </BaseModal>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import BaseModal from '../components/BaseModal.vue'

const router = useRouter()
const showTip = ref(false)
const form = reactive({
  username: '',
  password: '',
  remember: true
})

const handleLogin = () => {
  router.push('/main/materials')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: radial-gradient(circle at top, #eef4ff, #f6f9ff 60%, #ffffff);
}

.login-card {
  max-width: 520px;
  width: 100%;
  display: grid;
  gap: 16px;
}

.login-card h1 {
  font-size: 24px;
}

.login-card p {
  color: var(--muted);
  font-size: 14px;
}

.login-card form {
  display: grid;
  gap: 12px;
}

.login-card label {
  display: grid;
  gap: 6px;
  font-size: 13px;
  color: var(--muted);
}

.login-card input[type='text'],
.login-card input[type='password'] {
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
