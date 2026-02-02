<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-title">教学场景多模态数据自适应融合处理系统</div>
      <p class="login-subtitle">请登录后进入系统主界面</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="form-field">
          账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label class="form-field">
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="btn primary" type="submit">登录并进入</button>
      </form>
      <div class="login-tip">体验账号：teacher / 123456</div>
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
  localStorage.setItem('tm_logged_in', 'true');
  router.push('/app/data-collection');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f4f8ff, #eef3fb);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 18px;
  padding: 28px;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-title {
  font-size: 20px;
  font-weight: 700;
}

.login-subtitle {
  margin: 0;
  color: #5b6b8b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.login-tip {
  font-size: 12px;
  color: #7b88a8;
}
</style>
