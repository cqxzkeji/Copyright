<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h2>汽车车身正向开发管理软件</h2>
        <p>请登录后进入主界面</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          用户名称
          <input v-model="form.user" type="text" placeholder="请输入用户名" required />
        </label>
        <label>
          登录密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          角色选择
          <select v-model="form.role" required>
            <option value="">请选择角色</option>
            <option>项目经理</option>
            <option>需求负责人</option>
            <option>设计主管</option>
            <option>测试负责人</option>
            <option>生产主管</option>
          </select>
        </label>
        <div class="remember">
          <input id="remember" type="checkbox" v-model="form.remember" />
          <label for="remember">记住登录状态</label>
        </div>
        <button class="primary-button" type="submit">登录并进入系统</button>
      </form>
    </div>
    <div class="login-side">
      <div class="side-card">
        <h3>平台亮点</h3>
        <ul>
          <li>五大模块协同，覆盖需求到生产闭环</li>
          <li>实时看板与进度跟踪，统一风险管理</li>
          <li>跨团队协作与审批流，提升决策效率</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  user: '',
  password: '',
  role: '',
  remember: true
});

const handleLogin = () => {
  localStorage.setItem('session-user', form.user);
  localStorage.setItem('session-role', form.role);
  router.push('/demand');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  background: linear-gradient(135deg, #eff6ff, #fdf2f8);
}

.login-card {
  align-self: center;
  justify-self: center;
  background: #ffffff;
  padding: 36px;
  border-radius: 20px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.15);
  width: min(420px, 90%);
}

.login-header h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
  margin-bottom: 24px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #334155;
}

.login-form input,
.login-form select {
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #f8fafc;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 13px;
}

.primary-button {
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #4f46e5, #38bdf8);
  color: #fff;
  font-weight: 600;
}

.login-side {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.side-card {
  background: #ffffff;
  padding: 28px;
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.1);
}

.side-card h3 {
  margin-bottom: 14px;
}

.side-card ul {
  list-style: none;
  display: grid;
  gap: 10px;
  color: #475569;
}

.side-card li::before {
  content: '●';
  color: #38bdf8;
  margin-right: 8px;
}

@media (max-width: 960px) {
  .login-page {
    grid-template-columns: 1fr;
    padding: 24px 0;
  }

  .login-side {
    order: -1;
  }
}
</style>
