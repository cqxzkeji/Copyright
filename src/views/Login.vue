<template>
  <div class="login-shell">
    <div class="login-panel">
      <h1>高集成多场景装备平台</h1>
      <p>登录以接入多场景控制、运维与分析能力</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>
          <span>用户名</span>
          <input v-model="username" type="text" placeholder="指挥官 ID" required />
        </label>
        <label>
          <span>口令</span>
          <input v-model="password" type="password" placeholder="安全口令" required />
        </label>
        <button class="primary-btn" type="submit" :disabled="loading">
          {{ loading ? '正在核验...' : '进入指控中心' }}
        </button>
      </form>
      <transition name="fade">
        <p v-if="error" class="error">{{ error }}</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

const handleLogin = () => {
  error.value = '';
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    if (username.value && password.value) {
      router.push('/app/dashboard');
    } else {
      error.value = '请输入完整的认证信息';
    }
  }, 900);
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(circle at top, rgba(5, 195, 221, 0.25), rgba(11, 17, 32, 0.9));
}

.login-panel {
  width: min(420px, 100%);
  background: rgba(15, 23, 42, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 25px 60px rgba(5, 195, 221, 0.15);
}

h1 {
  margin: 0;
  font-size: 1.6rem;
}

p {
  margin: 0.5rem 0 1.5rem;
  color: var(--muted);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

input {
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(4, 7, 14, 0.8);
  padding: 0.85rem 1rem;
  color: var(--text);
}

input:focus {
  outline: 1px solid rgba(5, 195, 221, 0.7);
}

.error {
  margin-top: 1rem;
  color: var(--danger);
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
