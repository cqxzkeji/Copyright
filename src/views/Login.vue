<template>
  <div class="login-wrapper">
    <div class="login-panel">
      <section class="hero-copy">
        <p class="eyebrow">IT Consulting & PMO</p>
        <h1>信息技术咨询与项目管理平台</h1>
        <p>集中管理项目、资源、客户与数据分析，打造高效透明的交付体验。</p>
      </section>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          企业账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="actions">
          <label class="remember">
            <input type="checkbox" v-model="remember" />
            记住登录
          </label>
          <a class="link" href="#">忘记密码?</a>
        </div>
        <button type="submit">立即登录</button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: '', password: '' });
const remember = ref(true);
const error = ref('');

const handleLogin = () => {
  if (!form.account || !form.password) {
    error.value = '请输入完整的登录信息';
    return;
  }
  error.value = '';
  router.push('/dashboard');
};
</script>

<style scoped>
.login-wrapper {
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.login-panel {
  width: min(1100px, 100%);
  background: #fff;
  border-radius: 32px;
  padding: 64px;
  box-shadow: 0 35px 120px rgba(15, 23, 42, 0.18);
  display: flex;
  flex-wrap: wrap;
  gap: 48px;
}

.hero-copy {
  flex: 1 1 320px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #6366f1;
  font-weight: 600;
}

.hero-copy h1 {
  font-size: clamp(28px, 4vw, 46px);
  margin: 16px 0 12px;
}

.login-form {
  flex: 1 1 360px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-weight: 600;
  color: #1f2933;
}

input[type='text'],
input[type='password'] {
  border: 1px solid #d4d9e3;
  border-radius: 16px;
  padding: 14px 18px;
  font-size: 16px;
  background: #f9fafb;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #475569;
}

button {
  border: none;
  border-radius: 999px;
  padding: 14px 28px;
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(120deg, #2563eb, #9333ea);
  color: #fff;
}

.error {
  color: #ef4444;
}

@media (max-width: 768px) {
  .login-panel {
    padding: 32px;
  }
}
</style>
