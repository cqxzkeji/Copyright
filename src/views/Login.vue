<template>
  <div class="login-shell">
    <div class="login-card flat-card">
      <div class="login-header">
        <h1>危废回收管理系统</h1>
        <p>统一入口 · 监管全流程 · 智能化决策</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit" class="primary-btn">登录平台</button>
      </form>
      <p class="helper">首次登陆请联系管理员开通权限</p>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: 'admin', password: '123456' });

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #e0f2fe);
}

.login-card {
  width: min(420px, 90vw);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.login-header h1 {
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

input {
  width: 100%;
  border: none;
  background: #f8fafc;
  border-radius: 12px;
  padding: 12px 16px;
  font-size: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #475467;
  font-size: 14px;
}

.helper {
  text-align: center;
  color: #98a2b3;
}
</style>
