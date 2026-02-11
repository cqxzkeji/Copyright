<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const router = useRouter()
const loading = ref(false)
const formState = reactive({ username: 'admin', password: '123456', farmName: '示范生态农场' })

const login = async () => {
  loading.value = true
  setTimeout(() => {
    sessionStorage.setItem('afs_token', 'token-demo')
    sessionStorage.setItem('farm_name', formState.farmName)
    message.success('登录成功，欢迎进入系统')
    loading.value = false
    router.push('/dashboard')
  }, 800)
}
</script>

<template>
  <div class="login-page">
    <a-card class="login-card" :bordered="false">
      <h2>无抗养殖饲料配方智能推荐与成本核算系统</h2>
      <p>登录后可进入主界面管理五大功能模块</p>
      <a-form layout="vertical" @finish="login">
        <a-form-item label="账号" name="username" :rules="[{ required: true, message: '请输入账号' }]">
          <a-input v-model:value="formState.username" size="large" />
        </a-form-item>
        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formState.password" size="large" />
        </a-form-item>
        <a-form-item label="养殖场名称" name="farmName" :rules="[{ required: true, message: '请输入养殖场名称' }]">
          <a-input v-model:value="formState.farmName" size="large" />
        </a-form-item>
        <a-button html-type="submit" type="primary" size="large" block :loading="loading">登录并进入系统</a-button>
      </a-form>
    </a-card>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #e8f3ff, #ffffff);
  padding: 20px;
}

.login-card {
  width: min(520px, 96vw);
  border-radius: 20px;
  box-shadow: 0 16px 40px rgba(66, 126, 255, 0.16);
}

h2 { margin-bottom: 8px; }
p { color: #6b7280; margin-bottom: 20px; }
</style>
