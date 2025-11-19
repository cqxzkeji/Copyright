<template>
  <div class="login-page">
    <div class="card login-card">
      <h1>钢轨断口灰斑智能识别</h1>
      <p>请登录系统以接入实时检测管控网络</p>
      <form @submit.prevent="handleLogin" class="form">
        <label>
          用户名
          <input v-model="username" required placeholder="输入用户名" />
        </label>
        <label>
          密码
          <input v-model="password" type="password" required placeholder="输入密码" />
        </label>
        <button type="submit">登录</button>
      </form>
      <p class="hint">默认体验账号: expert / rail2024</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('expert');
const password = ref('rail2024');

const handleLogin = () => {
  if (username.value && password.value) {
    router.push('/main');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.login-card {
  width: min(420px, 95vw);
}

h1 {
  margin-bottom: 0.4rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-block: 1.5rem;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  gap: 0.35rem;
}

input {
  border: 1px solid #d1d7e6;
  border-radius: 10px;
  padding: 0.7rem 0.9rem;
  font-size: 1rem;
}

.hint {
  font-size: 0.9rem;
  color: #6b7280;
}
</style>
