<template>
  <div class="login-page">
    <el-card class="login-card" shadow="hover">
      <h2>MgoShort 管理平台登录</h2>
      <el-form :model="form" label-position="top">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-button type="primary" class="full" @click="handleLogin">登录并进入主界面</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入完整的账号和密码')
    return
  }
  localStorage.setItem('mgoshort-login', 'true')
  ElMessage.success('登录成功')
  router.push('/main/upload')
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #f9fbff, #eef4ff);
  padding: 20px;
}
.login-card {
  width: min(460px, 100%);
  border-radius: 18px;
}
.full {
  width: 100%;
}
</style>
