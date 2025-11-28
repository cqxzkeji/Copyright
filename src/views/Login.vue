<template>
  <div class="login-page">
    <div class="login-card card">
      <h1>自适应多维协同机器臂</h1>
      <p class="subtitle">精准控制云端工作台</p>
      <form @submit.prevent="handleLogin" class="grid" style="gap: 12px;">
        <div>
          <label>账户</label>
          <input v-model="form.username" placeholder="工程师邮箱或工号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div class="flex-between" style="gap:12px;flex-wrap: wrap;">
          <label style="display:flex;align-items:center;gap:6px;">
            <input type="checkbox" v-model="remember" style="width:auto;" />
            记住状态
          </label>
          <a href="#" style="color: var(--primary);font-weight:600;">忘记密码?</a>
        </div>
        <button type="submit" :disabled="loading" style="width:100%;background:linear-gradient(90deg,#3b82f6,#22c55e);">
          {{ loading ? '正在校验...' : '进入系统' }}
        </button>
      </form>
      <div class="login-meta">
        <div class="meta-item">
          <span class="badge tag-green">在线</span>
          <div>
            <div class="highlight">17</div>
            <small>在线机械臂</small>
          </div>
        </div>
        <div class="meta-item">
          <span class="badge tag-blue">任务</span>
          <div>
            <div class="highlight">42</div>
            <small>调度队列</small>
          </div>
        </div>
        <div class="meta-item">
          <span class="badge tag-orange">健康</span>
          <div>
            <div class="highlight">98.2%</div>
            <small>平均健康度</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const remember = ref(true)
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/app/robot-control')
  }, 800)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.12), transparent 30%),
    radial-gradient(circle at 80% 0%, rgba(34, 197, 94, 0.1), transparent 26%),
    linear-gradient(135deg, #f8fbff 0%, #eef2ff 100%);
}

.login-card {
  width: min(480px, 100%);
  text-align: center;
  padding: 30px;
}

.subtitle {
  color: #475569;
  margin-top: -8px;
  margin-bottom: 12px;
}

.login-meta {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid #e2e8f0;
}
</style>
