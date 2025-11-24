<template>
  <div class="login-shell">
    <div class="panel">
      <div class="branding">
        <p class="eyebrow">化妆品纳米成膜</p>
        <h1>甘蔗纤维素纳米成膜建模系统</h1>
        <p class="muted">登陆后即可配置建模、参数调控、材料分析与可视化流程。</p>
      </div>
      <form class="form" @submit.prevent="submit">
        <label>
          <span>用户名</span>
          <input v-model="username" placeholder="示例：researcher" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="password" type="password" placeholder="••••••" required />
        </label>
        <button type="submit" class="primary">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

const submit = () => {
  if (!username.value || !password.value) return;
  localStorage.setItem('loggedIn', 'true');
  router.push({ name: 'main' });
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #fdf6ff 0%, #e7f2ff 100%);
}

.panel {
  width: min(840px, 100%);
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
  display: grid;
  gap: 18px;
  border: 1px solid #e5e7eb;
}

.branding h1 {
  margin: 4px 0;
}

.eyebrow {
  margin: 0;
  font-weight: 700;
  color: var(--secondary);
}

.muted {
  margin: 0;
  color: #6b7280;
}

.form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 600;
}

input {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 12px;
  font-size: 16px;
}

.primary {
  margin-top: 6px;
  padding: 12px 16px;
  background: linear-gradient(120deg, var(--primary), #60a5fa);
  border: none;
  color: white;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(29, 155, 240, 0.25);
}
</style>
