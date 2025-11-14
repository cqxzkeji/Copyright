<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h1>VR 非遗文化展示系统</h1>
      <p>请先登录以进入数字化展陈管理平台</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit">进入主界面</button>
      </form>
      <small>为提升安全，所有操作均会被记录并可在后台统计分析。</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const handleLogin = () => {
  if (username.value.trim() && password.value) {
    router.push({ path: '/main' });
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: min(420px, 100%);
  background: rgba(255, 255, 255, 0.96);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 30px 60px rgba(79, 70, 229, 0.15);
  text-align: center;
}

h1 {
  margin-bottom: 0.5rem;
  color: #1d2a4a;
}

p {
  margin-top: 0;
  margin-bottom: 2rem;
  color: #5a6370;
}

label {
  display: block;
  text-align: left;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  color: #4c5672;
}

input {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid #e0e7ff;
  margin-top: 0.3rem;
}

button {
  width: 100%;
  background: linear-gradient(120deg, #4f46e5, #0ea5e9);
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.95rem;
  font-size: 1rem;
}

small {
  display: block;
  margin-top: 1.5rem;
  color: #97a0b6;
}
</style>
