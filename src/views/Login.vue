<template>
  <div class="login-page" aria-label="登录界面">
    <div class="login-card card">
      <div class="hero">
        <div>
          <p class="pill">慢性肾脏病风险评估平台</p>
          <h1>登录以开始管理患者</h1>
          <p class="subtitle">统一入口，集中采集、评估、随访与安全管理。</p>
        </div>
        <img src="https://cdn.jsdelivr.net/gh/alohe/placeholder/health-illustration.svg" alt="health" />
      </div>
      <form class="form" @submit.prevent="handleLogin">
        <label>
          账号
          <input v-model="form.username" placeholder="请输入工号或手机号" required />
        </label>
        <label>
          密码
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </label>
        <div class="actions">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" />
            记住登录状态
          </label>
          <button type="submit">立即登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const form = reactive({ username: '', password: '', remember: true });

const handleLogin = () => {
  if (form.username && form.password) {
    router.push('/main');
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-card {
  width: min(960px, 100%);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
}

.hero img {
  width: 260px;
  max-width: 90%;
}

.hero h1 {
  margin: 10px 0 6px;
}

.subtitle {
  color: #475569;
}

.form {
  display: grid;
  gap: 12px;
}

label {
  display: grid;
  gap: 6px;
  font-weight: 700;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}
</style>
