<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2>物流仓储作业优化与监控管理平台</h2>
      <el-form :model="loginForm" label-position="top">
        <el-form-item label="账号">
          <el-input v-model="loginForm.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <el-button type="primary" class="full" @click="handleLogin">登录</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loginForm = reactive({ username: '', password: '' })

const handleLogin = async () => {
  await ElMessageBox.alert('登录成功，正在进入主界面。', '提示', { type: 'success' })
  localStorage.setItem('warehouse-auth', '1')
  router.push('/dashboard')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: linear-gradient(120deg, #ebf5ff 0%, #fefcff 100%);
}
.login-card {
  width: min(420px, 100%);
  border-radius: 14px;
}
h2 {
  text-align: center;
  color: #2b3a55;
  margin-bottom: 16px;
}
.full {
  width: 100%;
}
</style>
