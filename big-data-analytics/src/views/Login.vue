<template>
  <div class="login-wrapper">
    <div class="panel">
      <h1>大数据实时流计算平台</h1>
      <p>统一管理数据采集、计算、存储、分析与监控</p>
      <form @submit.prevent="login">
        <label>账号</label>
        <input v-model="username" required placeholder="请输入账号" />
        <label>密码</label>
        <input type="password" v-model="password" required placeholder="请输入密码" />
        <button type="submit">立即登陆</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');

const login = () => {
  if (!username.value || !password.value) return;
  localStorage.setItem('bd-login', '1');
  router.push('/dashboard');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #0ea5e9, #0f172a);
  padding: 2rem;
}
.panel {
  width: min(420px, 92vw);
  background: rgba(255, 255, 255, 0.95);
  border-radius: 26px;
  padding: 2.5rem;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  text-align: center;
}
h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #0f172a;
}
p {
  margin: 0;
  color: #475569;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: left;
}
label {
  font-size: 0.9rem;
  color: #475569;
}
input {
  border: none;
  border-radius: 18px;
  padding: 0.8rem 1rem;
  background: #f8fafc;
}
button {
  border: none;
  border-radius: 20px;
  padding: 0.9rem;
  background: linear-gradient(120deg, #0ea5e9, #34d399);
  color: #fff;
  cursor: pointer;
  margin-top: 0.5rem;
  font-size: 1rem;
}
</style>
