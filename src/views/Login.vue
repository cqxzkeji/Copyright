<template>
  <div class="login-page">
    <div class="login-card">
      <h1>平台登录</h1>
      <form @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.account" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色
          <select v-model="form.role">
            <option>调度管理员</option>
            <option>运维主管</option>
            <option>水质分析员</option>
          </select>
        </label>
        <div class="login-actions">
          <span>安全接入 | 实时监控</span>
          <button class="primary-btn" type="submit">登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  account: "admin",
  password: "",
  role: "调度管理员"
});

const handleLogin = () => {
  router.push("/app");
};
</script>
