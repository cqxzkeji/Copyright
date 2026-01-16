<template>
  <div class="login-page">
    <div class="login-card">
      <h1>高性能计算集群管理平台</h1>
      <p>统一登录入口 · 租户与项目选择</p>
      <form @submit.prevent="handleLogin" class="form-grid">
        <label>
          登录账号
          <input v-model="form.username" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          租户
          <select v-model="form.tenant">
            <option>科研计算中心</option>
            <option>工业仿真平台</option>
            <option>智能算法实验室</option>
          </select>
        </label>
        <label>
          默认项目组
          <select v-model="form.project">
            <option>流体力学项目组</option>
            <option>生命科学项目组</option>
            <option>材料仿真项目组</option>
          </select>
        </label>
        <button class="action-button" type="submit">登录并进入控制台</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({
  username: 'admin',
  password: '******',
  tenant: '科研计算中心',
  project: '流体力学项目组'
});

const handleLogin = () => {
  router.push('/main/resource');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eef3ff 0%, #f8fafc 100%);
  padding: 20px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  width: min(420px, 90vw);
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.15);
}

.login-card h1 {
  margin: 0 0 8px;
  font-size: 22px;
}

.login-card p {
  margin: 0 0 24px;
  color: #5f6b85;
  font-size: 14px;
}
</style>
