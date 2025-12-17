<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div>
        <p class="badge">农产品电商</p>
        <h1>交易与订单管理平台</h1>
        <p class="sub">统一登录后可进入商品、交易、订单、售后与数据设置模块</p>
      </div>
      <form class="grid grid-2" @submit.prevent="handleLogin">
        <div class="field">
          <label>账号</label>
          <input v-model="form.user" class="input" placeholder="输入运营账号" required />
        </div>
        <div class="field">
          <label>密码</label>
          <input v-model="form.pass" type="password" class="input" placeholder="输入密码" required />
        </div>
        <div class="field" style="grid-column: span 2">
          <label>环境</label>
          <select v-model="form.env" class="input">
            <option value="生产">生产</option>
            <option value="测试">测试</option>
            <option value="培训">培训</option>
          </select>
        </div>
        <button type="submit" class="primary" style="grid-column: span 2">立即登录</button>
      </form>
      <div class="actions">
        <button class="ghost" @click="showTip = true">查看接入须知</button>
        <button class="ghost" @click="showReset = true">重置密码</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <h3>登录确认</h3>
          <button class="ghost" @click="showModal = false">✕</button>
        </div>
        <p>确认以 {{ form.user }} ({{ form.env }}) 进入系统？</p>
        <div class="modal-actions">
          <button class="ghost" @click="showModal = false">取消</button>
          <button class="primary" @click="confirmLogin">进入</button>
        </div>
      </div>
    </div>

    <div v-if="showTip" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <h3>接入须知</h3>
          <button class="ghost" @click="showTip = false">✕</button>
        </div>
        <ul>
          <li>请使用分配的运营账号登录。</li>
          <li>登录后可在主界面切换各功能模块。</li>
          <li>若发现数据异常，请及时反馈。</li>
        </ul>
        <div class="modal-actions">
          <button class="primary" @click="showTip = false">我已知悉</button>
        </div>
      </div>
    </div>

    <div v-if="showReset" class="modal-overlay" role="dialog" aria-modal="true">
      <div class="modal">
        <div class="modal-header">
          <h3>重置密码</h3>
          <button class="ghost" @click="showReset = false">✕</button>
        </div>
        <div class="field">
          <label>预留手机号</label>
          <input v-model="resetPhone" class="input" placeholder="输入手机号" />
        </div>
        <div class="modal-actions">
          <button class="ghost" @click="showReset = false">取消</button>
          <button class="primary" @click="resetPassword">发送验证码</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ user: 'market_admin', pass: '', env: '生产' })
const showModal = ref(false)
const showTip = ref(false)
const showReset = ref(false)
const resetPhone = ref('')

const handleLogin = () => {
  showModal.value = true
}

const confirmLogin = () => {
  localStorage.setItem('agri-token', `${form.user}-${Date.now()}`)
  showModal.value = false
  router.push('/main')
}

const resetPassword = () => {
  showReset.value = false
  alert(`验证码已发送到 ${resetPhone.value || '预留号码'}`)
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: linear-gradient(120deg, #e0f2fe, #fdf2f8, #fef9c3);
}

.login-card {
  width: min(960px, 100%);
  background: #fff;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  display: grid;
  gap: 18px;
}

h1 {
  margin: 6px 0;
}

.sub {
  color: #6b7280;
}

.field label {
  font-weight: 700;
  display: block;
  margin-bottom: 6px;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #6366f1);
  color: #fff;
  padding: 12px 14px;
}

.ghost {
  background: #f8fafc;
  color: #0f172a;
  padding: 10px 12px;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>
