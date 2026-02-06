<template>
  <div class="login-page">
    <div class="login-card">
      <header>
        <h1>智能项目管理与资源优化系统</h1>
        <p>大数据驱动的项目全流程管理平台</p>
      </header>
      <div class="form">
        <label>
          企业账号
          <input v-model="form.account" placeholder="请输入企业账号" />
        </label>
        <label>
          用户名
          <input v-model="form.user" placeholder="请输入用户名" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button class="ghost-btn" @click="openHelp">登录问题</button>
          <button class="primary-btn" @click="openLogin">登录进入</button>
        </div>
      </div>
    </div>
    <ModalBase :show="showHelp" title="登录帮助" @close="showHelp = false">
      <ul class="help-list">
        <li>确认已连接企业内网或 VPN。</li>
        <li>如忘记密码，请联系系统管理员重置。</li>
        <li>企业账号用于加载数据权限。</li>
      </ul>
      <template #footer>
        <button class="primary-btn" @click="showHelp = false">知道了</button>
      </template>
    </ModalBase>
    <ModalBase :show="showLogin" title="正在验证身份" @close="showLogin = false">
      <p>系统正在验证账号与角色权限，请稍候。</p>
      <div class="progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
      <p class="muted">验证进度：{{ progress }}%</p>
      <template #footer>
        <button class="ghost-btn" @click="showLogin = false">取消</button>
        <button class="primary-btn" @click="completeLogin">继续</button>
      </template>
    </ModalBase>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ModalBase from '../components/ModalBase.vue'

const router = useRouter()
const showHelp = ref(false)
const showLogin = ref(false)
const progress = ref(58)
const form = ref({
  account: '集团总部',
  user: '李思雅',
  password: '******'
})

const openHelp = () => {
  showHelp.value = true
}

const openLogin = () => {
  showLogin.value = true
}

const completeLogin = () => {
  localStorage.setItem('ipm-auth', 'true')
  showLogin.value = false
  router.push('/app/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 60%);
  padding: 24px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.18);
  padding: 32px;
  max-width: 460px;
  width: 100%;
}

header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

header p {
  color: #64748b;
  margin-bottom: 24px;
}

.form {
  display: grid;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 13px;
  color: #475569;
}

input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn {
  background: #2563eb;
  color: #fff;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
}

.ghost-btn {
  background: #e0e7ff;
  color: #3730a3;
  padding: 10px 16px;
  border-radius: 10px;
}

.progress {
  height: 10px;
  border-radius: 999px;
  background: #e2e8f0;
  margin: 12px 0 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #60a5fa, #34d399);
}

.muted {
  color: #64748b;
  font-size: 13px;
}

.help-list {
  display: grid;
  gap: 8px;
  color: #475569;
  font-size: 14px;
}
</style>
