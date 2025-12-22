<template>
  <div class="login">
    <div class="login-card">
      <div class="brand">
        <div class="logo">SM</div>
        <div>
          <h1>智能多传感器检测系统</h1>
          <p>统一管理雷达与视觉设备</p>
        </div>
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
          <span>记住账号</span>
        </label>
        <button class="primary" type="submit">登录系统</button>
      </form>
      <div class="tips">
        <span>演示账号：admin / 123456</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "admin",
  password: "123456",
  remember: true
});

const handleLogin = () => {
  router.push("/main/monitor");
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #dbeafe 100%);
}

.login-card {
  width: min(420px, 90vw);
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #2563eb;
  color: white;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.brand h1 {
  margin: 0;
  font-size: 20px;
}

.brand p {
  margin: 6px 0 0;
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

input[type="text"],
input[type="password"] {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-weight: 600;
  cursor: pointer;
}

.primary:hover {
  background: #1d4ed8;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tips {
  font-size: 12px;
  color: #94a3b8;
  text-align: center;
}
</style>
