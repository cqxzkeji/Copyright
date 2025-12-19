<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">农产品直播销售与内容管理平台</div>
      <p class="subtitle">请使用运营账号登录</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </label>
        <label class="inline">
          <input v-model="form.remember" type="checkbox" />
          记住账号
        </label>
        <button class="primary" type="submit">登录并进入系统</button>
      </form>
      <div class="login-tips">
        <span>技术支持：平台运营中心</span>
        <span>当前版本：V2.0</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  account: "",
  password: "",
  remember: true
});

const handleLogin = () => {
  router.push("/app/live-room");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #ffffff, #eef3ff 55%, #e3ebff 100%);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 18px 50px rgba(30, 60, 114, 0.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  color: #1c2f5a;
}

.subtitle {
  margin: 0;
  color: #5c6f91;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #4a5b7c;
}

.login-form input[type="text"],
.login-form input[type="password"] {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d7dfef;
  background: #f9fbff;
}

.login-form label.inline {
  grid-auto-flow: column;
  justify-content: start;
  align-items: center;
  gap: 8px;
}

.primary {
  border: none;
  background: linear-gradient(135deg, #3a7bff, #5ed0ff);
  color: #ffffff;
  padding: 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.login-tips {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #8a97b1;
}
</style>
