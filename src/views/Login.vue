<template>
  <div class="login-wrap">
    <div class="login-card card">
      <h1>多仓多车配送优化平台</h1>
      <p class="muted">统筹仓储、调度、监控与分析的智慧化平台</p>
      <form @submit.prevent="handleLogin" class="login-form">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="btn" type="submit">登陆</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: 'planner', password: '123456' });

const handleLogin = () => {
  router.push('/main/warehouse');
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.login-card {
  max-width: 420px;
  width: 100%;
  text-align: center;
  background: linear-gradient(145deg, #fff, #f0f9ff);
}

.login-card h1 {
  margin: 0 0 8px;
}

.muted {
  color: #475569;
  margin-bottom: 20px;
}

.login-form {
  display: grid;
  gap: 12px;
  text-align: left;
}

label {
  display: grid;
  gap: 6px;
  color: #0f172a;
  font-weight: 600;
}

input {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
}
</style>
