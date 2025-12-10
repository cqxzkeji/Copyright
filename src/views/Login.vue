<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">畜牧养殖档案管理与智能分析平台</div>
      <p class="muted">统一登陆入口，登录后进入主界面。</p>
      <form class="form-grid" @submit.prevent="login">
        <label>
          用户名
          <input v-model="form.username" placeholder="admin" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="123456" required />
        </label>
        <button class="button" type="submit">登陆</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });
const error = ref('');

const login = () => {
  if (form.username.trim() && form.password.trim()) {
    localStorage.setItem('livestock-token', `${form.username}-${Date.now()}`);
    router.push('/dashboard');
  } else {
    error.value = '请输入用户名和密码';
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #e5f0ff, #f6fffb);
}

.login-card {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(61, 139, 253, 0.15);
  width: min(420px, 90vw);
  display: grid;
  gap: 16px;
}

.brand {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
}

.muted {
  color: var(--muted);
  margin: 0;
}

.error {
  color: #d14343;
  margin: 0;
}
</style>
