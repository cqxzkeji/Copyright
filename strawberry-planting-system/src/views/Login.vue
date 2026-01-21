<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>草莓迷宫式与高位种植环境监控系统</h1>
        <p>请登录以进入环境监控与智能管理平台</p>
      </div>
      <form class="form-grid" @submit.prevent="onLogin">
        <div>
          <label>账号</label>
          <input v-model="form.account" placeholder="请输入账号" required />
        </div>
        <div>
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div>
          <label>角色</label>
          <select v-model="form.role">
            <option>生产主管</option>
            <option>温室管理员</option>
            <option>数据分析员</option>
          </select>
        </div>
        <button class="btn" type="submit">登录进入主界面</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({
  account: '',
  password: '',
  role: '生产主管'
})

const onLogin = () => {
  router.push('/main/environment')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f2f7ff 0%, #ffffff 55%, #f6fbff 100%);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(21, 44, 77, 0.12);
}

.login-header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

.login-header p {
  color: #5a6b8c;
  margin-bottom: 24px;
}
</style>
