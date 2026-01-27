<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="login-header">
        <span class="badge">Seat Engineering Suite</span>
        <h1>汽车座椅工程设计管理系统</h1>
        <p>统一管理项目、需求、设计、验证与变更归档。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="input-group">
          <label>账号</label>
          <input v-model="form.username" type="text" placeholder="输入账号" required />
        </div>
        <div class="input-group">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="输入密码" required />
        </div>
        <div class="input-group">
          <label>角色</label>
          <select v-model="form.role">
            <option value="engineer">座椅工程师</option>
            <option value="manager">项目经理</option>
            <option value="quality">质量负责人</option>
          </select>
        </div>
        <button class="primary" type="submit">登录进入</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: '',
  password: '',
  role: 'engineer',
});

const handleLogin = () => {
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: radial-gradient(circle at top, #e0f2fe, #f8fafc 55%);
}

.login-card {
  width: min(480px, 92vw);
  padding: 36px 32px;
}

.login-header h1 {
  margin: 10px 0 6px;
  font-size: 26px;
}

.login-header p {
  margin: 0 0 20px;
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.primary {
  background: linear-gradient(90deg, #38bdf8, #4f46e5);
  color: #fff;
  padding: 12px 18px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}
</style>
