<template>
  <div class="login">
    <div class="login-card">
      <div class="login-header">
        <img src="/src/assets/field.svg" alt="logo" />
        <div>
          <h1>农产品供应链信息化管理</h1>
          <p>请输入账号密码进入系统</p>
        </div>
      </div>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" />
        </label>
        <div class="actions">
          <button type="button" class="ghost" @click="fillDemo">体验账号</button>
          <button type="submit" class="primary">登录</button>
        </div>
      </form>
      <div class="tips">
        <span>数据安全合规 · 统一身份认证</span>
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
  password: ''
});

const fillDemo = () => {
  form.username = 'demo-admin';
  form.password = '123456';
};

const handleLogin = () => {
  router.push('/dashboard/source');
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #eef2ff, #f8fafc);
  padding: 24px;
}

.login-card {
  width: min(520px, 92vw);
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.15);
}

.login-header {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.login-header img {
  width: 54px;
  height: 54px;
}

.login-header h1 {
  margin: 0 0 6px;
  font-size: 20px;
}

.login-header p {
  margin: 0;
  color: #64748b;
  font-size: 13px;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-size: 14px;
}

input {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  flex: 1;
}

.ghost {
  background: #f1f5f9;
  border: none;
  color: #0f172a;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  flex: 1;
}

.tips {
  margin-top: 20px;
  color: #94a3b8;
  font-size: 12px;
  text-align: center;
}
</style>
