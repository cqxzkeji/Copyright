<template>
  <div class="login-page">
    <div class="login-card">
      <h1>系统登录</h1>
      <p>请输入账号信息以进入数据中台管理平台。</p>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          身份
          <select v-model="form.role">
            <option value="admin">管理员</option>
            <option value="analyst">分析师</option>
            <option value="viewer">访客</option>
          </select>
        </label>
        <button type="submit">登录进入</button>
      </form>
      <div class="tip">提示：首次登录将自动创建演示环境。</div>
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
  role: "admin"
});

const handleLogin = () => {
  localStorage.setItem("dip_authed", "true");
  localStorage.setItem("dip_role", form.role);
  router.push("/collection");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #eef4ff, #ffffff);
  padding: 24px;
}

.login-card {
  width: min(420px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

h1 {
  margin: 0;
  font-size: 24px;
}

p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #374151;
}

input,
select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #f9fafb;
}

button {
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.tip {
  font-size: 12px;
  color: #9ca3af;
}
</style>
