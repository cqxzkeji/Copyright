<template>
  <div class="login-wrap">
    <div class="card">
      <h1>关务风险预警与合规管理平台</h1>
      <p>请输入账号登录系统</p>
      <form @submit.prevent="login">
        <label>账号</label>
        <input v-model="form.username" placeholder="admin" required />
        <label>密码</label>
        <input v-model="form.password" type="password" placeholder="123456" required />
        <button type="submit">登录</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const login = () => {
  sessionStorage.setItem('ccs_token', `${form.username}-token`);
  router.push('/dashboard/risk');
};
</script>

<style scoped>
.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 20% 10%, #d9ebff, #f4f8ff 50%, #e7f2ff);
  padding: 16px;
}
.card {
  width: min(92vw, 420px);
  border-radius: 16px;
  background: #fff;
  padding: 28px;
  box-shadow: 0 10px 30px rgba(78, 127, 211, 0.2);
}
h1 { font-size: 22px; margin-bottom: 8px; }
p { color: #6b7f99; margin-top: 0; }
form { display: grid; gap: 10px; }
input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #c7daf7;
}
button {
  margin-top: 10px;
  border: none;
  border-radius: 10px;
  padding: 11px;
  background: linear-gradient(90deg, #4890ff, #4db8ff);
  color: #fff;
  font-weight: 700;
}
</style>
