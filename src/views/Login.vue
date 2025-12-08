<template>
  <div class="login-shell">
    <div class="login-card">
      <div class="hero">
        <p class="badge">江南园林 · 虚拟仿真</p>
        <h1>假山叠石工艺虚拟仿真实训</h1>
        <p class="subtitle">体验从工具准备到评估管理的完整数字化流程</p>
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="username" type="text" placeholder="输入学号或工号" required />
        <label>密码</label>
        <input v-model="password" type="password" placeholder="输入密码" required />
        <div class="actions">
          <button type="submit" class="primary-button">登陆</button>
          <button type="button" class="secondary-button" @click="reset">重置</button>
        </div>
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

const handleLogin = () => {
  if (username.value.trim() && password.value.trim()) {
    router.push('/main');
  }
};

const reset = () => {
  username.value = '';
  password.value = '';
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  width: min(900px, 100%);
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
}

.hero h1 {
  margin: 12px 0 6px;
  font-size: 30px;
}

.hero .subtitle {
  margin: 0;
  color: #475569;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form label {
  font-weight: 700;
}

.form input {
  padding: 12px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}
</style>
