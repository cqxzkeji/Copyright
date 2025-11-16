<template>
  <div class="login-wrapper">
    <section class="login-panel">
      <header>
        <h1>智能文案与视觉素材协同创作平台</h1>
        <p>登陆后即可开启多模态创意协同体验</p>
      </header>
      <form @submit.prevent="handleLogin">
        <label>
          邮箱
          <input v-model="form.email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="••••••••" required />
        </label>
        <button type="submit" :disabled="loading">
          {{ loading ? '正在登录...' : '登录' }}
        </button>
      </form>
      <footer>
        <p>支持企业 SSO，文案协同更安全</p>
      </footer>
    </section>
    <div class="floating-card">
      <h3>平台亮点</h3>
      <ul>
        <li>AI 文案 + 视觉一体化</li>
        <li>跨平台广告一键适配</li>
        <li>实时数据洞察提升 ROI</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const form = reactive({ email: '', password: '' });

const handleLogin = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    router.push('/workspace');
  }, 800);
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0ea5e9, #2563eb);
  padding: 3rem 1rem;
}

.login-panel {
  background: #fff;
  border-radius: 24px;
  padding: 2.5rem;
  width: min(420px, 90vw);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.25);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

header h1 {
  margin: 0;
  font-size: 1.8rem;
}

header p {
  margin: 0.25rem 0 0;
  color: #475569;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

label {
  font-size: 0.9rem;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

input {
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  background: #f1f5f9;
  font-size: 1rem;
}

button {
  border: none;
  border-radius: 999px;
  padding: 0.85rem;
  font-size: 1rem;
  background: #2563eb;
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

footer {
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
}

.floating-card {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: white;
  padding: 1.5rem;
  border-radius: 18px;
  margin-left: 2rem;
  max-width: 260px;
  backdrop-filter: blur(12px);
}

.floating-card h3 {
  margin-top: 0;
}

@media (max-width: 900px) {
  .login-wrapper {
    flex-direction: column;
    gap: 1.5rem;
  }

  .floating-card {
    margin-left: 0;
    width: min(320px, 90vw);
  }
}
</style>
