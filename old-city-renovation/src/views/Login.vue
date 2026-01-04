<template>
  <div class="login-page">
    <div class="login-card card">
      <div class="hero">
        <div>
          <p class="badge">老旧城区数字化改造</p>
          <h1>功能提升与改造管理系统</h1>
          <p class="tip">
            统一入口，连接基础信息、项目管理、施工监管、公众反馈、统计决策五大模块。
          </p>
        </div>
        <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3d7.svg" alt="city" />
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-grid">
          <div>
            <label>账号</label>
            <input v-model="form.account" required placeholder="输入账号" />
          </div>
          <div>
            <label>密码</label>
            <input v-model="form.password" required type="password" placeholder="输入密码" />
          </div>
        </div>
        <div class="actions" style="justify-content: space-between; margin-top: 16px;">
          <label style="display: flex; align-items: center; gap: 8px; font-weight: 500;">
            <input type="checkbox" v-model="remember" /> 记住账号
          </label>
          <button class="btn" type="submit">进入系统</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ account: 'admin', password: '123456' });
const remember = ref(true);

const handleLogin = () => {
  localStorage.setItem('old-city-remember', remember.value ? form.account : '');
  router.push('/main');
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 30px;
}

.login-card {
  max-width: 960px;
  width: 100%;
  display: grid;
  gap: 18px;
}

.hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: center;
  gap: 10px;
}

.hero img {
  width: 120px;
  justify-self: end;
}

h1 {
  margin: 8px 0;
  color: #0f172a;
}

.login-form {
  background: #f8fbff;
  border-radius: 12px;
  padding: 16px;
  border: 1px dashed #dbe6ff;
}
</style>
