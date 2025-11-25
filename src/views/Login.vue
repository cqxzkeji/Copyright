<template>
  <div class="login-page">
    <div class="login-panel">
      <div class="brand">城市空间再开发</div>
      <h2>过程追踪与绩效分析系统</h2>
      <p class="sub">请使用城市更新管理账户登录系统。</p>
      <form @submit.prevent="login">
        <label class="field">账号
          <input v-model="form.username" class="input" required placeholder="请输入账号" />
        </label>
        <label class="field">密码
          <input v-model="form.password" class="input" required type="password" placeholder="请输入密码" />
        </label>
        <button class="primary-btn" style="width:100%; justify-content:center; margin-top:8px">立即登录</button>
      </form>
      <div v-if="error" class="alert" style="margin-top:12px">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const error = ref('')

const login = () => {
  if (form.username && form.password) {
    error.value = ''
    router.push('/main')
  } else {
    error.value = '请输入完整的账号与密码信息'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #dbeafe, transparent 30%),
    radial-gradient(circle at 80% 0%, #cffafe, transparent 25%),
    #eff6ff;
  padding: 24px;
}

.login-panel {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 18px 45px rgba(59, 130, 246, 0.15);
  border: 1px solid #e0e7ff;
}

.brand {
  display: inline-block;
  padding: 8px 14px;
  border-radius: 999px;
  background: linear-gradient(120deg, #3b82f6, #10b981);
  color: #fff;
  font-weight: 700;
  margin-bottom: 12px;
}

h2 {
  margin: 6px 0 4px;
}

.sub {
  color: #6b7280;
  margin-bottom: 18px;
}

.field {
  display: block;
  color: #374151;
  font-weight: 600;
  margin-bottom: 8px;
}
</style>
