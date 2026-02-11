<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = reactive({ username: '', password: '' })
const loading = ref(false)
const errorVisible = ref(false)

const onLogin = () => {
  if (!form.username || !form.password) {
    errorVisible.value = true
    return
  }
  loading.value = true
  setTimeout(() => {
    localStorage.setItem('smart-image-token', 'ready')
    loading.value = false
    router.push('/main/image-generation')
  }, 500)
}
</script>

<template>
  <div class="login-page">
    <el-card class="login-card">
      <div class="title">智能图像生成与资源调度系统</div>
      <el-form label-position="top">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <el-button type="primary" :loading="loading" style="width: 100%" @click="onLogin">登录</el-button>
    </el-card>

    <el-dialog v-model="errorVisible" modal title="登录提示" width="400px">
      <el-result icon="warning" title="账号或密码不能为空" sub-title="请完善登录信息后重试。" />
      <template #footer>
        <el-button type="primary" @click="errorVisible = false">知道了</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%);
}

.login-card {
  width: min(420px, 100%);
  border-radius: 14px;
}

.title {
  text-align: center;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 18px;
}
</style>
