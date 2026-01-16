<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>旅挖钻智能钻进感知与决策系统</h1>
        <p>智能洞察钻进过程，实时决策保障安全高效。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          <span>账号</span>
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="remember">
          <input v-model="form.remember" type="checkbox" />
          记住本次登陆
        </label>
        <button type="submit" class="primary">进入系统</button>
      </form>
      <div class="login-footer">
        <span>平台状态：运行正常</span>
        <span>版本：V2.4.8</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  remember: true
});

const handleLogin = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(160deg, #e0f2fe, #eef2ff 45%, #f8fafc 100%);
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 24px 60px rgba(30, 64, 175, 0.15);
}

.login-header h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1e3a8a;
}

.login-header p {
  margin: 0 0 18px;
  color: #64748b;
  font-size: 14px;
}

.login-form {
  display: grid;
  gap: 14px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input[type='text'],
input[type='password'] {
  border: 1px solid #cbd5f5;
  border-radius: 12px;
  padding: 10px 12px;
  outline: none;
  background: #f8fafc;
}

input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.18);
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
}

button.primary {
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  font-size: 15px;
  color: white;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  cursor: pointer;
}

.login-footer {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}
</style>
