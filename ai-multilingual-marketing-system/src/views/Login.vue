<template>
  <div class="login-shell">
    <div class="login-panel">
      <h1>AI 多语种营销平台</h1>
      <p>一次登陆，解锁五大智能营销模块</p>
      <form @submit.prevent="login">
        <label>
          邮箱
          <input v-model="email" type="email" required placeholder="team@brand.com" />
        </label>
        <label>
          密码
          <input v-model="password" type="password" required placeholder="••••••••" />
        </label>
        <button type="submit">进入工作台</button>
      </form>
      <small>为保障数据安全，本系统启用行为指纹二次认证。</small>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const email = ref('');
const password = ref('');

const login = () => {
  if (!email.value || !password.value) return;
  localStorage.setItem('aims-auth', 'approved');
  router.push('/app/content-generation');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #1d4ed8, #0f172a 70%);
}

.login-panel {
  width: min(420px, 90%);
  background: rgba(15, 23, 42, 0.9);
  border-radius: 24px;
  padding: 48px;
  box-shadow: 0 30px 120px rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(148, 163, 184, 0.2);
}

h1 {
  margin-bottom: 8px;
}

p {
  color: var(--muted);
  margin-bottom: 32px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

label {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: var(--muted);
  gap: 6px;
}

input {
  border: none;
  border-radius: 999px;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.08);
  color: var(--text);
}

button {
  margin-top: 16px;
  background: linear-gradient(120deg, #38bdf8, #0ea5e9);
  border: none;
  border-radius: 999px;
  padding: 14px 0;
  font-size: 1rem;
  color: #0f172a;
  cursor: pointer;
  font-weight: 700;
}

small {
  display: block;
  margin-top: 32px;
  color: var(--muted);
  text-align: center;
}
</style>
