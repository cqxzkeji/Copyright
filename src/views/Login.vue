<template>
  <div class="login-page">
    <div class="login-card">
      <header>
        <h1>农业质量溯源管理系统</h1>
        <p>统一档案、全程记录、检测溯源、物流监管、分析预警</p>
      </header>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="row">
          <input v-model="form.remember" type="checkbox" /> 记住登录状态
        </label>
        <button type="submit">登录进入系统</button>
      </form>
      <footer>
        <span>温馨提示：支持多角色登录与权限分级。</span>
      </footer>
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
  router.push("/main/origin");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 55%);
  padding: 24px;
}

.login-card {
  width: min(420px, 92vw);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
}

h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #0f172a;
}

p {
  margin: 0 0 24px;
  color: #64748b;
}

form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

input[type="text"],
input[type="password"] {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

button {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
}

footer {
  margin-top: 20px;
  color: #94a3b8;
  font-size: 12px;
}
</style>
