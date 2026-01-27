<template>
  <div class="login-page">
    <div class="login-card">
      <div class="brand">
        <span class="brand-dot"></span>
        <div>
          <h1>汽车NVH综合优化管理</h1>
          <p>统一试验、仿真与优化的协同平台</p>
        </div>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          租户/事业部
          <select v-model="form.tenant" required>
            <option value="">请选择租户</option>
            <option>整车NVH中心</option>
            <option>动力总成研究院</option>
            <option>声品质评估实验室</option>
          </select>
        </label>
        <label>
          账号
          <input v-model="form.account" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <button class="primary" type="submit">登录并进入主界面</button>
      </form>
      <div class="login-hint">
        <div>
          <strong>今日提醒</strong>
          <p>3 个项目等待校准结果复核，2 个优化方案待审批。</p>
        </div>
        <button class="ghost" type="button" @click="handleQuickAccess">快速体验</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const form = reactive({
  tenant: "",
  account: "",
  password: ""
});

const handleLogin = () => {
  router.push("/main/project-center");
};

const handleQuickAccess = () => {
  router.push("/main/data-collection");
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(140deg, #e9f1ff, #f7fafc 60%);
  padding: 32px 16px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  width: min(520px, 100%);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.16);
  display: grid;
  gap: 24px;
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
}

.brand-dot {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  background: linear-gradient(135deg, #3b82f6, #22c55e);
}

.brand h1 {
  margin: 0 0 6px;
  font-size: 22px;
}

.brand p {
  margin: 0;
  color: #64748b;
}

.login-form {
  display: grid;
  gap: 16px;
}

label {
  display: grid;
  gap: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 14px;
}

input,
select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d6deea;
  font-size: 14px;
}

.primary {
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
}

.ghost {
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  color: #475569;
  cursor: pointer;
}

.login-hint {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
}

.login-hint p {
  margin: 6px 0 0;
  color: #64748b;
}
</style>
