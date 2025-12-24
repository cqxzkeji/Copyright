<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="intro">
        <h1>农村电商运营与资源整合</h1>
        <p>统一入口，调度主体、商品、订单、分析与协同服务。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <label>
          账户
          <input v-model="form.account" required placeholder="输入管理员账号" />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" required placeholder="输入密码" />
        </label>
        <button class="btn" type="submit">进入驾驶舱</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: 'admin', password: '123456' });

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
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, #e8f3ff, transparent 40%),
    radial-gradient(circle at 80% 0%, #fff4e5, transparent 32%), #f6fbff;
}

.login-card {
  max-width: 620px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

.intro h1 {
  margin: 0 0 6px;
}

.login-form {
  display: grid;
  gap: 12px;
}

.login-form label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: #2c3f56;
}

.login-form input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7e4f5;
  background: #f8fbff;
}
</style>
