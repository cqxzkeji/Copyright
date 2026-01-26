<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-title">智链信息服务与管理系统</div>
      <p class="login-subtitle">统一身份认证 · 安全可信登录</p>
      <form class="form-grid" @submit.prevent="handleLogin">
        <label class="form-field">
          用户名
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label class="form-field">
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label class="form-field">
          登录角色
          <select v-model="form.role">
            <option value="管理员">管理员</option>
            <option value="分析师">分析师</option>
            <option value="审计员">审计员</option>
          </select>
        </label>
        <button class="btn" type="submit">登录并进入主界面</button>
      </form>
      <div class="login-footer">
        <span class="badge">实时监控</span>
        <span class="badge">多源接入</span>
        <span class="badge">智能决策</span>
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
  role: "管理员"
});

const handleLogin = () => {
  router.push("/app/data-collection");
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(120deg, #f8fafc, #e0f2fe);
}

.login-card {
  max-width: 420px;
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.15);
}

.login-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #475569;
  margin-bottom: 20px;
}

.login-footer {
  margin-top: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
</style>
