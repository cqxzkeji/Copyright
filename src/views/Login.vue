<template>
  <div class="login-shell">
    <section class="login-panel">
      <header>
        <p class="eyebrow">Hazardous Waste</p>
        <h1>危废回收管理系统</h1>
        <p class="subtitle">集中管理登记、运输、仓储、合规和分析</p>
      </header>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="环保管理员" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </label>
        <div class="actions">
          <label class="remember">
            <input v-model="remember" type="checkbox" />
            记住账号
          </label>
          <button type="submit">进入系统</button>
        </div>
      </form>
    </section>
    <section class="illustration">
      <div class="floating-card">
        <p>实时监控</p>
        <strong>{{ highlight }}</strong>
      </div>
      <div class="floating-card">
        <p>今日待办</p>
        <strong>7 项任务</strong>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const remember = ref(true);
const highlight = '96% 流程合规率';

const handleLogin = () => {
  window.localStorage.setItem('hwms-authed', 'yes');
  if (remember.value) {
    window.localStorage.setItem('hwms-username', form.username);
  }
  router.push('/dashboard');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  gap: 3rem;
}

.login-panel {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 24px;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 20px 50px rgba(99, 102, 241, 0.15);
}

header h1 {
  font-size: 2rem;
  color: #0f172a;
}

header .eyebrow {
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.15em;
  color: #7c3aed;
}

.subtitle {
  color: #475569;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  color: #475569;
  font-weight: 600;
}

input[type='text'],
input[type='password'] {
  background: #f8fafc;
  border-radius: 14px;
  padding: 0.85rem 1rem;
}

.actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.9rem;
}

.remember {
  flex-direction: row;
  align-items: center;
  gap: 0.45rem;
  font-weight: 500;
}

button {
  background: linear-gradient(120deg, #2563eb, #7c3aed);
  color: #fff;
  border-radius: 16px;
  padding: 0.85rem 2.5rem;
}

.illustration {
  flex: 1;
  min-height: 360px;
  border-radius: 32px;
  background: linear-gradient(135deg, #1d4ed8, #9333ea);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  padding: 1rem 1.5rem;
  border-radius: 18px;
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.2);
}

.floating-card:nth-child(1) {
  top: 70px;
  left: 60px;
}

.floating-card:nth-child(2) {
  bottom: 80px;
  right: 70px;
}

@media (max-width: 960px) {
  .login-shell {
    flex-direction: column;
    padding: 1.5rem;
  }
  .illustration {
    width: 100%;
    min-height: 260px;
  }
}
</style>
