<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-banner">
        <h1>高集成多场景装备控制与运维平台</h1>
        <p>统一接入 · 协同管控 · 智能运维 · 数据驱动</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" type="text" placeholder="请输入账号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <label>
          登录场景
          <select v-model="form.scene">
            <option>综合指挥中心</option>
            <option>机库保障区</option>
            <option>远程监控站</option>
            <option>舰载控制室</option>
          </select>
        </label>
        <button type="submit">进入平台</button>
        <p class="hint">演示账号可直接登录，系统将自动分配权限。</p>
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
  scene: '综合指挥中心'
});

const handleLogin = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  background: radial-gradient(circle at top, #ffffff 0%, #e9f1ff 50%, #f5f8ff 100%);
}

.login-card {
  width: min(960px, 100%);
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(25, 45, 90, 0.15);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  overflow: hidden;
}

.login-banner {
  padding: 48px 40px;
  background: linear-gradient(140deg, #2f80ed, #56ccf2);
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
  justify-content: center;
}

.login-banner h1 {
  font-size: 28px;
  margin: 0;
}

.login-form {
  padding: 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

label {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
  color: #526277;
}

input,
select {
  border: 1px solid #dbe4f0;
  border-radius: 12px;
  padding: 10px 14px;
  font-size: 14px;
  background: #f7faff;
}

button {
  margin-top: 12px;
  border: none;
  border-radius: 12px;
  padding: 12px;
  font-size: 16px;
  color: #fff;
  background: linear-gradient(120deg, #2f80ed, #56ccf2);
  cursor: pointer;
}

.hint {
  font-size: 12px;
  color: #8a97a7;
}
</style>
