<template>
  <div class="login-container">
    <div class="login-card">
      <div class="welcome">
        <p class="badge">AIGC Intelligent Platform</p>
        <h1>登录智能一体化平台</h1>
        <p class="muted">一键进入创作、分析、训练、交互与管理的统一工作台。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="label">账号</label>
        <input v-model="form.username" class="input-field" placeholder="请输入账号" required />
        <label class="label">密码</label>
        <input v-model="form.password" class="input-field" type="password" placeholder="请输入密码" required />
        <div class="toolbar">
          <button type="submit">登录</button>
          <button type="button" @click="showHint = true">查看登录提示</button>
        </div>
      </form>
    </div>
    <ModalDialog :open="showHint" title="登录提醒" :on-close="() => (showHint = false)">
      <p>使用任何示例账号即可进入主界面，数据操作均为演示模式。</p>
      <div class="modal-actions">
        <button @click="showHint = false">已知晓</button>
      </div>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalDialog from '../components/ModalDialog.vue'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const showHint = ref(false)

const handleLogin = () => {
  router.push('/main')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #e0f7fa 0%, #fdf2f8 100%);
}

.login-card {
  width: min(880px, 96vw);
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: var(--shadow);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
}

.welcome h1 {
  margin: 6px 0;
}

.muted {
  color: #6b7280;
}

.login-form {
  background: #f9fafb;
  padding: 16px;
  border-radius: 14px;
}
</style>
