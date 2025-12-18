<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <h2>农产品产供销一体化管理平台</h2>
        <p>统一账号登录，进入全链路协同中台</p>
      </div>
      <form @submit.prevent="onLogin" class="login-form">
        <label>
          用户名
          <input v-model="form.username" placeholder="输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <button class="primary-btn" type="submit">登录</button>
      </form>
      <div class="login-footer">
        <span class="tag">数据安全加密</span>
        <span class="tag">亮色自适应界面</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const onLogin = () => {
  if (form.username && form.password) {
    sessionStorage.setItem('agri-user', form.username);
    router.push('/app/production');
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}
.login-card {
  width: min(480px, 100%);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.login-header h2 {
  margin: 0 0 6px;
  color: #1d3557;
}
.login-header p {
  margin: 0;
  color: #4a5568;
}
.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.login-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 700;
  color: #1d3557;
}
.login-form input {
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #d9e2ec;
  background: #f9fbfd;
  font-size: 1rem;
}
.login-footer {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
