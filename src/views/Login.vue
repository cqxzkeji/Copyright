<template>
  <div class="login-page">
    <div class="login-card">
      <h1>高性能计算集群管理平台 V1.0</h1>
      <p class="subtitle">统一入口 · 安全认证 · 轻量运维</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="account" type="text" placeholder="输入账号" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="输入密码" required />
        </label>
        <button type="submit">登录并进入平台</button>
      </form>
      <div class="login-meta">
        <span>支持统一认证与多因素验证</span>
        <span>系统状态：运行正常</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const account = ref("");
const password = ref("");
const router = useRouter();

const handleLogin = () => {
  if (account.value && password.value) {
    router.push("/app/dashboard");
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.15);
  display: grid;
  gap: 20px;
}

h1 {
  margin: 0;
  font-size: 22px;
}

.subtitle {
  margin: 0;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input {
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  padding: 10px 12px;
  font-size: 14px;
}

button {
  border: none;
  background: #2563eb;
  color: #fff;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

button:hover {
  transform: translateY(-1px);
}

.login-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}
</style>
