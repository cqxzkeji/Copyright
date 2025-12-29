<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <el-icon size="22" color="var(--primary-color)"><DataAnalysis /></el-icon>
        <span>大数据可视化与智能分析平台</span>
      </div>
      <el-form :model="form" label-position="top" @submit.prevent>
        <el-form-item label="用户名">
          <el-input v-model="form.username" placeholder="输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" placeholder="输入密码" type="password" show-password />
        </el-form-item>
        <el-button type="primary" size="large" style="width: 100%;" @click="handleLogin">
          登录平台
        </el-button>
      </el-form>
      <div class="login-footer">
        <span>智能治理 · 可视分析 · 高效决策</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  if (!form.username || !form.password) {
    ElMessage.warning('请输入账号密码');
    return;
  }
  sessionStorage.setItem('bd-token', `${form.username}-token`);
  ElMessage.success(`欢迎回来，${form.username}`);
  router.push('/');
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: radial-gradient(circle at 10% 20%, #dbeafe, #eef2ff 30%),
    radial-gradient(circle at 80% 0%, #e0f2fe, #f8fafc 35%),
    radial-gradient(circle at 50% 80%, #fef3c7, #fff 20%);
  padding: 20px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 18px;
  padding: 28px 26px;
  box-shadow: 0 18px 60px rgba(59, 130, 246, 0.15);
  border: 1px solid #e5e7eb;
}

.login-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
}

.login-footer {
  margin-top: 14px;
  color: #6b7280;
  text-align: center;
  font-size: 13px;
}
</style>
