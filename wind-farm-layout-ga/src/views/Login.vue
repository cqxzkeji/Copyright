<template>
  <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 24px;">
    <div class="card" style="max-width: 520px; width: 100%;">
      <div class="flex-between" style="margin-bottom: 18px;">
        <div>
          <div class="pill">风电场风机布局优化</div>
          <h2 style="margin: 10px 0 6px 0">欢迎登录</h2>
          <p style="margin: 0; color: #4b5563;">登录后管理项目并启动遗传算法优化</p>
        </div>
        <div style="width: 80px; height: 80px; border-radius: 24px; background: linear-gradient(145deg, #93c5fd, #3b82f6); display: grid; place-items: center; color: #fff; font-weight: 700;">GA</div>
      </div>
      <form @submit.prevent="handleLogin" style="display: grid; gap: 12px;">
        <div>
          <label>账号</label>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <label style="display: flex; gap: 6px; align-items: center; font-weight: 600; color: #2563eb;">
            <input type="checkbox" v-model="form.remember" style="width: auto;" /> 记住登录
          </label>
          <span style="color: #1d4ed8; font-size: 13px;">安全协议校验通过</span>
        </div>
        <button class="button-primary" type="submit">登录</button>
      </form>
      <div v-if="error" style="margin-top: 10px; color: #b91c1c; font-size: 13px;">{{ error }}</div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const error = ref('')
const form = reactive({ username: '', password: '', remember: true })

const handleLogin = () => {
  if (!form.username || !form.password) {
    error.value = '请输入账号和密码'
    return
  }
  localStorage.setItem('wf-token', `${form.username}-${Date.now()}`)
  error.value = ''
  router.push('/main/site')
}
</script>
