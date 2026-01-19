<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <div class="logo">ML</div>
        <div>
          <h1>模型训练与管理平台</h1>
          <p>统一管理数据、训练、评估与部署</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户名
          <input v-model="form.username" type="text" placeholder="请输入用户名" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option value="admin">管理员</option>
            <option value="engineer">算法工程师</option>
            <option value="analyst">数据分析师</option>
          </select>
        </label>
        <button type="submit">登录</button>
      </form>
      <div class="tips">
        <span>推荐使用企业账号统一认证</span>
        <span>支持多因素验证登录</span>
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
  role: "admin"
});

const handleLogin = () => {
  router.push("/main/data");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: linear-gradient(120deg, #e0f2fe 0%, #f8fafc 45%, #fef9c3 100%);
}

.login-card {
  width: min(520px, 100%);
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #2563eb;
  color: #fff;
  font-weight: 700;
  display: grid;
  place-items: center;
  font-size: 20px;
}

.brand h1 {
  margin: 0;
  font-size: 24px;
}

.brand p {
  margin: 4px 0 0;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

.login-form input,
.login-form select {
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  background: #f8fafc;
}

.login-form button {
  margin-top: 8px;
  border: none;
  background: #2563eb;
  color: #fff;
  padding: 12px;
  border-radius: 12px;
  font-size: 16px;
  cursor: pointer;
}

.tips {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
}

@media (max-width: 520px) {
  .tips {
    flex-direction: column;
    gap: 6px;
    text-align: center;
  }
}
</style>
