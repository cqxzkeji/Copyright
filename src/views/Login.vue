<template>
  <div class="login">
    <div class="login-card card">
      <div class="login-header">
        <h1>多语言营销素材制作与管理系统</h1>
        <p>统一管理内容制作、翻译、本地化与多渠道发布。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label class="field">
          账号
          <input v-model="form.account" class="input" type="text" placeholder="输入账号" required />
        </label>
        <label class="field">
          密码
          <input v-model="form.password" class="input" type="password" placeholder="输入密码" required />
        </label>
        <label class="field">
          角色
          <select v-model="form.role" class="select" required>
            <option value="">请选择</option>
            <option value="manager">营销负责人</option>
            <option value="translator">本地化经理</option>
            <option value="designer">素材设计师</option>
          </select>
        </label>
        <button class="btn" type="submit">登录并进入主界面</button>
      </form>
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
  role: ""
});

const handleLogin = () => {
  router.push("/dashboard/content");
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at top, #f3f7ff, #f8f9fc 60%);
  padding: 40px 20px;
}

.login-card {
  max-width: 520px;
  width: 100%;
  display: grid;
  gap: 20px;
}

.login-header h1 {
  font-size: 24px;
  margin: 0 0 8px;
}

.login-header p {
  margin: 0;
  color: #6c7a96;
}

.login-form {
  display: grid;
  gap: 16px;
}

.field {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #3a4a6b;
}
</style>
