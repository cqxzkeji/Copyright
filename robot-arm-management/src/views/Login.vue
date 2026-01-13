<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>高精度智能驱动机械臂综合管理系统</h1>
        <p>请登录后进入统一运维调度中心</p>
      </div>
      <div class="login-form">
        <label class="form-group">
          <span>账号</span>
          <input v-model="form.username" class="form-input" placeholder="请输入账号" />
        </label>
        <label class="form-group">
          <span>密码</span>
          <input v-model="form.password" class="form-input" type="password" placeholder="请输入密码" />
        </label>
        <label class="form-group">
          <span>站点</span>
          <select v-model="form.site" class="form-input">
            <option>华东智造中心</option>
            <option>华南试验基地</option>
            <option>西部协同工厂</option>
          </select>
        </label>
        <button class="btn" @click="handleLogin">登录并进入</button>
      </div>
      <div class="login-footer">
        <div class="badge">全链路安全认证</div>
        <span>当前版本 4.2.1 · 在线</span>
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
  password: "",
  site: "华东智造中心"
});

const handleLogin = () => {
  router.push("/main/device");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top, #ffffff, #e5edff);
}

.login-card {
  width: min(420px, 90vw);
  background: #ffffff;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.12);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.login-header h1 {
  font-size: 22px;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #64748b;
  font-size: 12px;
}
</style>
