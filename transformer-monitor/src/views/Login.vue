<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>变压器变形实时在线监测与预警平台</h1>
        <p>统一身份认证 · 安全可信访问</p>
      </div>
      <el-form :model="form" label-width="80px">
        <el-form-item label="账号">
          <el-input v-model="form.username" placeholder="输入用户名" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="输入密码" />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择角色">
            <el-option label="运维管理员" value="admin" />
            <el-option label="监测工程师" value="engineer" />
            <el-option label="调度管理" value="dispatcher" />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="login-actions">
        <el-button type="primary" @click="openLoginDialog">登录</el-button>
        <el-button @click="openResetDialog">重置</el-button>
      </div>
    </div>

    <el-dialog v-model="loginDialog" title="登录验证中" width="420px" :close-on-click-modal="false">
      <p>正在验证账号权限并加载实时监测配置，请稍候。</p>
      <el-progress :percentage="loginProgress" status="success" />
      <template #footer>
        <el-button type="primary" @click="confirmLogin">进入系统</el-button>
      </template>
    </el-dialog>

    <el-dialog v-model="resetDialog" title="重置提示" width="380px" :close-on-click-modal="false">
      <p>确认清空已输入的登录信息吗？</p>
      <template #footer>
        <el-button @click="resetDialog = false">取消</el-button>
        <el-button type="primary" @click="resetForm">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = ref({
  username: 'transformer_admin',
  password: '******',
  role: 'admin'
});

const loginDialog = ref(false);
const resetDialog = ref(false);
const loginProgress = ref(65);

const openLoginDialog = () => {
  loginProgress.value = 65;
  loginDialog.value = true;
};

const confirmLogin = () => {
  loginProgress.value = 100;
  setTimeout(() => {
    loginDialog.value = false;
    router.push('/main');
  }, 300);
};

const openResetDialog = () => {
  resetDialog.value = true;
};

const resetForm = () => {
  form.value = { username: '', password: '', role: '' };
  resetDialog.value = false;
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef6ff, #ffffff);
  padding: 32px;
}

.login-card {
  width: min(460px, 100%);
  background: #ffffff;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 18px 40px rgba(15, 40, 80, 0.1);
}

.login-header h1 {
  font-size: 20px;
  margin-bottom: 8px;
  color: #1a2b5c;
}

.login-header p {
  margin-bottom: 24px;
  color: #5b6b8f;
}

.login-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
