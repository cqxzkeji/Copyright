<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = reactive({ username: '', password: '' })

const handleLogin = () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入账号和密码')
    return
  }
  loading.value = true
  setTimeout(() => {
    sessionStorage.setItem('auth', '1')
    loading.value = false
    ElMessage.success('登录成功')
    router.push('/dashboard')
  }, 800)
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>海关单证智能审核与管理软件</h2>
      <el-form :model="form" label-position="top">
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="请输入密码" show-password />
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loading" style="width: 100%" @click="handleLogin">登录</el-button>
    </el-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 16px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
}

h2 {
  text-align: center;
  color: #1d4ed8;
  margin: 0 0 20px;
}
</style>
