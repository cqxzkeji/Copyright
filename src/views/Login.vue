<template>
  <div class="login-wrapper">
    <div class="login-card">
      <h2>农村电商平台登录</h2>
      <p class="subtitle">统一登录后访问信息服务、商品撮合、订单物流等模块</p>
      <form @submit.prevent="handleLogin">
        <label>账号</label>
        <input v-model="form.username" required placeholder="请输入账号" />
        <label>密码</label>
        <input v-model="form.password" type="password" required placeholder="请输入密码" />
        <button class="primary-btn" style="width:100%;margin-top:12px;">登录</button>
      </form>
      <div class="tips">演示账号任意填写即可体验。</div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '' });

const handleLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 20% 20%, #e0f1ff, #f4f7fb 45%),
    radial-gradient(circle at 80% 20%, #ffe9e1, #f6f9ff 50%);
}

.login-card {
  width: min(420px, 90vw);
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.08);
  border: 1px solid #e7eff7;
}

h2 {
  margin: 0 0 6px;
  color: #13315c;
}

.subtitle {
  margin: 0 0 20px;
  color: #5c6c80;
}

label {
  display: block;
  margin-top: 12px;
  color: #4a5b73;
}

input {
  width: 100%;
  padding: 10px 12px;
  margin-top: 6px;
  border: 1px solid #d8e4f4;
  border-radius: 10px;
  background: #f9fbff;
}

.tips {
  margin-top: 14px;
  color: #6d7b8f;
  font-size: 13px;
}
</style>
