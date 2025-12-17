<template>
  <div class="login-page">
    <div class="login-panel card">
      <div class="logo">🏗️</div>
      <h1 class="header-title">地下室及裙楼公区验收跟踪</h1>
      <p class="subtle">登录后进入各功能模块</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>账号</label>
          <input v-model="form.username" placeholder="输入账号" required />
        </div>
        <div class="form-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </div>
        <button class="button" type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'inspector', password: '123456' });

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: radial-gradient(circle at 20% 20%, #e0f2fe, transparent 35%),
    radial-gradient(circle at 80% 0, #e0e7ff, transparent 30%),
    radial-gradient(circle at 80% 80%, #fef9c3, transparent 32%),
    #f8fafc;
}

.login-panel {
  width: min(480px, 100%);
  text-align: center;
  padding: 32px;
}

.logo {
  font-size: 38px;
  background: var(--primary-light);
  width: 72px;
  height: 72px;
  border-radius: 20px;
  display: grid;
  place-items: center;
  margin: 0 auto 16px;
}

.login-form {
  text-align: left;
  margin-top: 20px;
}
</style>
