<template>
  <div class="login-wrapper">
    <div class="login-card card">
      <div class="hero">
        <h1>变压器变形实时监测平台</h1>
        <p>统一采集、分析与预警，让变压器运行状态一目了然。</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-row">
          <label>账号</label>
          <input v-model="form.username" placeholder="请输入账号" required />
        </div>
        <div class="form-row">
          <label>密码</label>
          <input v-model="form.password" type="password" placeholder="请输入密码" required />
        </div>
        <div class="actions">
          <label class="remember">
            <input v-model="form.remember" type="checkbox" />
            记住账号
          </label>
          <span class="link">忘记密码?</span>
        </div>
        <button class="btn" type="submit">立即登录</button>
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
  if (!form.username || !form.password) {
    alert('请输入完整的账号与密码');
    return;
  }
  sessionStorage.setItem('loggedIn', 'true');
  sessionStorage.setItem('account', form.username);
  router.push('/main');
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: radial-gradient(circle at 20% 20%, #e3f2fd, transparent 40%),
    radial-gradient(circle at 80% 0%, #fce4ec, transparent 35%),
    radial-gradient(circle at 60% 60%, #e8f5e9, transparent 35%),
    #f6f9fc;
}

.login-card {
  width: min(460px, 100%);
}

.hero h1 {
  margin: 0 0 6px;
}

.hero p {
  margin: 0 0 18px;
  color: var(--muted);
}

.login-form .actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 12px 0 16px;
}

.remember {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
}

.link {
  color: var(--primary);
  font-weight: 600;
}
</style>
