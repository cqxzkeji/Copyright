<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="brand">
        <div class="logo">CI</div>
        <div>
          <h1>企业咨询信息智能研判系统</h1>
          <p>统一咨询数据池与风险研判的智能中枢</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          租户/单位
          <select v-model="tenant" required>
            <option value="">请选择租户</option>
            <option>省级企业服务中心</option>
            <option>产业园区咨询部</option>
            <option>集团风险管理部</option>
          </select>
        </label>
        <label>
          账号
          <input v-model="username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="password" type="password" placeholder="请输入密码" required />
        </label>
        <button type="submit" class="primary">登录并进入主界面</button>
      </form>
      <div class="tips">
        <span>支持单点登录、短信校验与多因子验证</span>
        <span class="tag">当前版本: V1.0</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const tenant = ref("");
const username = ref("");
const password = ref("");

const handleLogin = () => {
  router.push("/main/intake");
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #dbeafe, #f8fafc);
  padding: 24px;
}

.login-card {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  width: min(540px, 90vw);
  box-shadow: 0 28px 60px rgba(15, 23, 42, 0.15);
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 24px;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: #2563eb;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: #475569;
}

input,
select {
  border: 1px solid #cbd5f5;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  margin-top: 8px;
}

.tips {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  color: #64748b;
  font-size: 12px;
}

.tag {
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 999px;
}
</style>
