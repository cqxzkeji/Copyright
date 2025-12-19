<template>
  <div class="login-page">
    <div class="login-card">
      <h2>平台登录</h2>
      <p>农产品仓储物流与供应管理平台</p>
      <div class="input-group">
        <label>账号</label>
        <input v-model="form.username" placeholder="请输入账号" />
      </div>
      <div class="input-group">
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="请输入密码" />
      </div>
      <button class="primary-btn" @click="handleLogin">登录进入</button>
      <div class="tips">演示账号：admin / 123456</div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: ''
});

const handleLogin = () => {
  if (!form.username || !form.password) {
    alert('请输入账号和密码');
    return;
  }
  localStorage.setItem('agri-auth', 'true');
  router.push('/supplier-management');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(120deg, #e6f0ff, #f8fbff);
  padding: 24px;
}

.login-card {
  width: min(420px, 95vw);
  background: #fff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(31, 42, 68, 0.15);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-card h2 {
  font-size: 24px;
}

.login-card p {
  color: #6b7280;
}

.tips {
  font-size: 12px;
  color: #94a3b8;
  margin-top: 4px;
}
</style>
