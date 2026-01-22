<template>
  <div class="login">
    <div class="login-card">
      <div class="logo">AG</div>
      <h1>农业机械挡泥板组合设计软件</h1>
      <p>请使用工程账号登录以进入设计平台</p>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          <span>账号</span>
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          <span>密码</span>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          <span>部门</span>
          <select v-model="form.team">
            <option value="整机平台">整机平台</option>
            <option value="结构设计">结构设计</option>
            <option value="材料工艺">材料工艺</option>
          </select>
        </label>
        <button class="primary" type="submit">登录进入</button>
      </form>
      <div class="tips">
        <span>示例账号：engineer</span>
        <span>支持多端自适应布局</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  account: "engineer",
  password: "123456",
  team: "结构设计",
});

const handleLogin = () => {
  router.push("/dashboard");
};
</script>

<style scoped>
.login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: linear-gradient(120deg, #e0f2fe, #f8fafc);
}

.login-card {
  width: min(460px, 92vw);
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 24px 50px rgba(15, 23, 42, 0.1);
  text-align: center;
}

.logo {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8, #2563eb);
  margin: 0 auto 16px;
  color: #fff;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 20px;
}

h1 {
  font-size: 20px;
  margin-bottom: 8px;
}

p {
  color: #64748b;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
}

label span {
  display: block;
  font-size: 13px;
  color: #475569;
  margin-bottom: 6px;
}

input,
select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
}

.primary {
  margin-top: 8px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.tips {
  margin-top: 16px;
  font-size: 12px;
  color: #94a3b8;
  display: flex;
  justify-content: space-between;
}
</style>
