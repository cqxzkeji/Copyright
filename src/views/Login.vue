<template>
  <div class="login-shell">
    <div class="login-card">
      <h2>城区存量资产盘活与利用管理平台</h2>
      <p>请使用内部账号登录以进入系统。</p>
      <div class="form-grid">
        <div class="input-group">
          <label>用户名</label>
          <input v-model="form.username" placeholder="请输入用户名" />
        </div>
        <div class="input-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </div>
      </div>
      <div class="action-row" style="margin-top: 12px;">
        <button @click="login">立即登录</button>
        <button style="background:#eef2ff;color:#0b5bd3" @click="showGuide = true">登录须知</button>
      </div>
    </div>
    <ModalDialog v-if="showGuide" title="登录须知" @close="showGuide = false">
      <p>平台为区级资产工作专用，访问将记录操作日志。遇到问题请联系管理员重置权限。</p>
    </ModalDialog>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import ModalDialog from '../components/ModalDialog.vue';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const showGuide = ref(false);

const login = () => {
  if (form.username && form.password) {
    router.push('/main/asset-ledger');
  } else {
    showGuide.value = true;
  }
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #e5f0ff, #f7f9fc 60%);
  padding: 24px;
}

.login-card {
  max-width: 520px;
  width: 100%;
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 18px 70px rgba(0, 0, 0, 0.07);
  border: 1px solid #e5e7eb;
}

.login-card h2 {
  margin: 0 0 8px;
}

.login-card p {
  margin: 0 0 18px;
  color: #4b5563;
}
</style>
