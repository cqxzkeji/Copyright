<template>
  <div class="login-page">
    <div class="login-card">
      <h2>欢迎登录云端业务管理系统</h2>
      <p>请使用管理员账号进入资源调度中心</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          验证码
          <input v-model="form.code" type="text" placeholder="6位验证码" required />
        </label>
        <button type="submit">登录并进入控制台</button>
      </form>
      <div class="tips">
        <span>安全提示：所有操作均会记录在审计日志中。</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  username: "",
  password: "",
  code: ""
});

const handleLogin = () => {
  localStorage.setItem("crm-auth", "true");
  router.push("/dashboard");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #e0f2fe, #f8fafc);
  padding: 24px;
}

.login-card {
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  width: min(420px, 100%);
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.15);
}

.login-card h2 {
  margin-top: 0;
}

.login-card p {
  color: #64748b;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #cbd5f5;
  background: #f8fafc;
}

button {
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  border: none;
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  font-size: 15px;
  cursor: pointer;
}

.tips {
  margin-top: 16px;
  font-size: 12px;
  color: #94a3b8;
}
</style>
